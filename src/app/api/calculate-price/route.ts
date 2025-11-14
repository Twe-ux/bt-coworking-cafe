import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SpaceConfiguration from "@/models/spaceConfiguration";

/**
 * POST /api/calculate-price
 * Calculate price for a reservation based on space configuration
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { spaceType, reservationType, startTime, endTime, numberOfPeople } =
      body;

    // Validation
    if (!spaceType || !reservationType || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get space configuration
    const configuration = await SpaceConfiguration.findOne({
      spaceType,
      isActive: true,
      isDeleted: false,
    });

    if (!configuration) {
      return NextResponse.json(
        { error: "Space configuration not found or inactive" },
        { status: 404 }
      );
    }

    const { pricing, minCapacity, maxCapacity } = configuration;
    const people = numberOfPeople || 1;

    // Validate capacity
    if (people < minCapacity || people > maxCapacity) {
      return NextResponse.json(
        {
          error: `Number of people must be between ${minCapacity} and ${maxCapacity}`,
        },
        { status: 400 }
      );
    }

    let basePrice = 0;
    let duration = 0;

    // Calculate based on reservation type
    switch (reservationType) {
      case "hourly": {
        // Calculate hours between start and end time
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationMs = end.getTime() - start.getTime();
        duration = durationMs / (1000 * 60 * 60); // Convert to hours

        if (duration <= 0) {
          return NextResponse.json(
            { error: "End time must be after start time" },
            { status: 400 }
          );
        }

        basePrice = pricing.hourly * duration;
        break;
      }

      case "daily": {
        basePrice = pricing.daily;
        duration = 1;
        break;
      }

      case "weekly": {
        basePrice = pricing.weekly;
        duration = 7;
        break;
      }

      case "monthly": {
        basePrice = pricing.monthly;
        duration = 30;
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid reservation type" },
          { status: 400 }
        );
    }

    // Apply per-person multiplier if configured
    const totalPrice = pricing.perPerson ? basePrice * people : basePrice;

    return NextResponse.json({
      success: true,
      data: {
        spaceType,
        reservationType,
        basePrice,
        numberOfPeople: people,
        perPerson: pricing.perPerson,
        totalPrice,
        duration,
        durationUnit:
          reservationType === "hourly"
            ? "hours"
            : reservationType === "daily"
            ? "days"
            : reservationType === "weekly"
            ? "weeks"
            : "months",
      },
    });
  } catch (error) {
    console.error("Error calculating price:", error);
    return NextResponse.json(
      { error: "Failed to calculate price" },
      { status: 500 }
    );
  }
}
