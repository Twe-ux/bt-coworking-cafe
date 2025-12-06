import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Reservation } from '@/models/reservation';
import SpaceConfiguration from '@/models/spaceConfiguration';
import { User } from '@/models/user';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/lib/auth-options';
import { sendBookingConfirmation } from '@/lib/email/emailService';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const body = await request.json();

    const {
      spaceType,
      date,
      startTime,
      endTime,
      numberOfPeople,
      reservationType,
      basePrice,
      servicesPrice,
      totalPrice,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      additionalServices,
      requiresPayment,
    } = body;

    // Validation
    if (!spaceType || !date || !startTime || !endTime || !numberOfPeople) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!contactName || !contactEmail || !contactPhone) {
      return NextResponse.json(
        { success: false, error: 'Contact information is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Find or create user
    let userId;
    if (session?.user) {
      // User is logged in
      userId = session.user.id;
    } else {
      // Create or find guest user by email
      let user = await User.findOne({ email: contactEmail });
      if (!user) {
        // Create a guest user
        user = await User.create({
          email: contactEmail,
          name: contactName,
          username: contactEmail.split('@')[0] + '_' + Date.now(),
          password: Math.random().toString(36), // Random password for guest
          role: 'user', // Will need to be populated with Role reference
        });
      }
      userId = user._id;
    }

    // Map URL space types to database spaceType values
    const spaceTypeMap: Record<string, string> = {
      'open-space': 'open-space',
      'meeting-room-glass': 'salle-verriere',
      'meeting-room-floor': 'salle-etage',
      'event-space': 'evenementiel',
    };

    const dbSpaceType = spaceTypeMap[spaceType] || spaceType;

    // Find space configuration
    const spaceConfig = await SpaceConfiguration.findOne({
      spaceType: dbSpaceType,
      isActive: true,
      isDeleted: false,
    });

    if (!spaceConfig) {
      return NextResponse.json(
        {
          success: false,
          error: `No active space configuration found for type: ${spaceType}`,
        },
        { status: 404 }
      );
    }

    // Check if space requires a quote instead of direct booking
    if (spaceConfig.requiresQuote) {
      return NextResponse.json(
        {
          success: false,
          error: 'This space requires a custom quote. Please contact us directly.',
        },
        { status: 400 }
      );
    }

    // Validate booking date is in the future
    const bookingDate = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < now) {
      return NextResponse.json(
        { success: false, error: 'Booking date must be in the future' },
        { status: 400 }
      );
    }

    // Validate time format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json(
        { success: false, error: 'Invalid time format' },
        { status: 400 }
      );
    }

    // Validate end time is after start time
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      return NextResponse.json(
        { success: false, error: 'End time must be after start time' },
        { status: 400 }
      );
    }

    // Check for overlapping bookings
    const overlappingBooking = await Reservation.findOne({
      spaceType: dbSpaceType,
      date: bookingDate,
      status: { $nin: ['cancelled'] },
      $or: [
        { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gt: startTime } }] },
        { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gte: endTime } }] },
        { $and: [{ startTime: { $gte: startTime } }, { endTime: { $lte: endTime } }] },
      ],
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: 'This time slot is already booked. Please select a different time.',
        },
        { status: 409 }
      );
    }

    // Create the reservation
    const reservation = await Reservation.create({
      user: userId,
      spaceType: dbSpaceType,
      date: bookingDate,
      startTime,
      endTime,
      numberOfPeople,
      status: 'pending',
      reservationType: reservationType || 'hourly',
      basePrice: basePrice || 0,
      servicesPrice: servicesPrice || 0,
      totalPrice: totalPrice || basePrice || 0,
      contactName,
      contactEmail,
      contactPhone,
      specialRequests,
      additionalServices: additionalServices || [],
      requiresPayment: requiresPayment !== false, // Default to true
      paymentStatus: 'pending',
    });

    // Populate the reservation with user details
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('user', 'name email');

    // Send confirmation email
    try {
      await sendBookingConfirmation(contactEmail, {
        name: contactName,
        spaceName: spaceConfig.name,
        date: bookingDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        time: `${startTime} - ${endTime}`,
        price: totalPrice || basePrice || 0,
        bookingId: (reservation._id as mongoose.Types.ObjectId).toString(),
        requiresPayment: requiresPayment !== false,
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the whole request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        data: populatedReservation,
        message: 'Reservation created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}
