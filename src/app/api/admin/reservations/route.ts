import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { Reservation } from "@/models/reservation";

/**
 * GET /api/admin/reservations
 * Get all reservations (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Check if user is admin
    // For now, allow any authenticated user

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const spaceType = searchParams.get("spaceType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: Record<string, unknown> = {
      isDeleted: false,
    };

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.startDate = {};
      if (startDate) {
        (query.startDate as Record<string, unknown>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.startDate as Record<string, unknown>).$lte = new Date(endDate);
      }
    }

    const reservations = await Reservation.find(query)
      .populate("user", "name email username")
      .populate("space", "name slug spaceType")
      .sort({ startDate: -1 })
      .limit(limit)
      .skip(skip);

    // Filter by spaceType if specified (after populate)
    let filteredReservations = reservations;
    if (spaceType) {
      filteredReservations = reservations.filter(
        (r) =>
          ((r.space as unknown as Record<string, unknown>)?.spaceType === spaceType)
      );
    }

    const total = await Reservation.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: filteredReservations,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit,
      },
    });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
