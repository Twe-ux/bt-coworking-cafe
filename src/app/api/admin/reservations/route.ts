import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { Reservation } from "@/models/reservation";
import { options } from "@/lib/auth-options";
import { logger } from "@/lib/logger";

/**
 * GET /api/admin/reservations
 * Get all reservations (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(options);

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Check if user is admin or higher (level >= 80)
    if (session.user.role.level < 80) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const spaceType = searchParams.get("spaceType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") || "100");
    const skip = parseInt(searchParams.get("skip") || "0");

    const query: Record<string, unknown> = {};

    if (status) {
      query.status = status;
    }

    if (spaceType) {
      query.spaceType = spaceType;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        (query.date as Record<string, unknown>).$gte = new Date(startDate);
      }
      if (endDate) {
        (query.date as Record<string, unknown>).$lte = new Date(endDate);
      }
    }

    const reservations = await Reservation.find(query)
      .populate("user", "name email username")
      .sort({ date: -1, startTime: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Reservation.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: reservations,
      pagination: {
        total,
        limit,
        skip,
        hasMore: total > skip + limit,
      },
    });
  } catch (error) {
    logger.error("Error fetching reservations", { component: "API /admin/reservations", data: error });
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
