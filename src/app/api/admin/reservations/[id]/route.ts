import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { Reservation } from "@/models/reservation";
import { options } from "@/lib/auth-options";
import { logger } from "@/lib/logger";

/**
 * PATCH /api/admin/reservations/[id]
 * Update reservation status (admin only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await request.json();
    const { status, paymentStatus } = body;

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const reservation = await Reservation.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    ).populate("user", "name email username");

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    logger.error("Error updating reservation", { component: "API /admin/reservations/[id] PATCH", data: error });
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/reservations/[id]
 * Cancel reservation (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const reservation = await Reservation.findByIdAndUpdate(
      params.id,
      { status: "cancelled", cancelledAt: new Date() },
      { new: true }
    );

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    logger.error("Error cancelling reservation", { component: "API /admin/reservations/[id] DELETE", data: error });
    return NextResponse.json(
      { error: "Failed to delete reservation" },
      { status: 500 }
    );
  }
}
