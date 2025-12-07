import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import { Reservation } from "@/models/reservation";
import GlobalHoursConfiguration from "@/models/globalHours";
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

    // Si c'est une réservation événementielle confirmée et que ce n'est pas une privatisation partielle,
    // créer automatiquement une fermeture exceptionnelle
    if (
      status === "confirmed" &&
      reservation.spaceType === "evenementiel" &&
      !reservation.isPartialPrivatization
    ) {
      try {
        // Récupérer la configuration globale
        const globalConfig = await GlobalHoursConfiguration.findOne().sort({ createdAt: -1 });

        if (globalConfig) {
          // Vérifier si une fermeture n'existe pas déjà pour cette date
          const existingClosure = globalConfig.exceptionalClosures.find((closure: any) => {
            const closureDate = new Date(closure.date);
            const reservationDate = new Date(reservation.date);
            return (
              closureDate.toISOString().split('T')[0] === reservationDate.toISOString().split('T')[0] &&
              closure.reason?.includes('Privatisation événementiel')
            );
          });

          if (!existingClosure) {
            // Ajouter la fermeture exceptionnelle
            globalConfig.exceptionalClosures.push({
              date: reservation.date,
              reason: `Privatisation événementiel - ${reservation.confirmationNumber || 'Sans numéro'}`,
              startTime: reservation.startTime,
              endTime: reservation.endTime,
              isFullDay: false,
            });

            await globalConfig.save();
            logger.info("Fermeture exceptionnelle créée automatiquement", {
              reservationId: reservation._id,
              date: reservation.date,
              timeRange: `${reservation.startTime} - ${reservation.endTime}`,
            });
          }
        }
      } catch (closureError) {
        // Log l'erreur mais ne pas faire échouer la mise à jour de réservation
        logger.error("Erreur lors de la création de la fermeture exceptionnelle", {
          error: closureError,
          reservationId: reservation._id,
        });
      }
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
