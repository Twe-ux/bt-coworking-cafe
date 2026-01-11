/**
 * Email Service using Resend
 *
 * Configure in .env.local:
 * RESEND_API_KEY=re_...
 * RESEND_FROM_EMAIL=Coworking Café <noreply@coworkingcafe.fr>
 */

import { Resend } from "resend";
import {
  generateConfirmationEmail,
  generateDepositHoldEmail,
  generateDepositCapturedEmail,
  generateDepositReleasedEmail,
  generateCancellationEmail,
  generateValidatedEmail,
  generateBookingInitialEmail,
  generateReminderEmail,
  generateReservationCancelledEmail,
  generateCardSavedEmail,
  generateReservationRejectedEmail,
} from "./templates";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

const getResendClient = () => {
  return new Resend(process.env.RESEND_API_KEY);
};

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const resend = getResendClient();

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function sendBookingConfirmation(
  email: string,
  bookingDetails: {
    name: string;
    spaceName: string;
    date: string;
    time: string;
    price: number;
    bookingId: string;
    requiresPayment: boolean;
    depositAmount?: number;
    captureMethod?: "manual" | "automatic";
    additionalServices?: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    numberOfPeople?: number;
  }
): Promise<boolean> {
  const subject = "Confirmation de réservation - Coworking Café";

  const html = generateBookingInitialEmail({
    name: bookingDetails.name,
    spaceName: bookingDetails.spaceName,
    date: bookingDetails.date,
    time: bookingDetails.time,
    price: bookingDetails.price,
    bookingId: bookingDetails.bookingId,
    requiresPayment: bookingDetails.requiresPayment,
    depositAmount: bookingDetails.depositAmount,
    captureMethod: bookingDetails.captureMethod,
    additionalServices: bookingDetails.additionalServices,
    numberOfPeople: bookingDetails.numberOfPeople,
  });

  const text = `
Bonjour ${bookingDetails.name},

Nous avons bien reçu votre ${
    bookingDetails.requiresPayment ? "réservation" : "demande de réservation"
  }.

Détails de votre réservation :
- Espace : ${bookingDetails.spaceName}
- Date : ${bookingDetails.date}
- Heure : ${bookingDetails.time}
- Prix : ${bookingDetails.price.toFixed(2)}€
- Numéro de réservation : ${bookingDetails.bookingId}

${
  bookingDetails.additionalServices &&
  bookingDetails.additionalServices.length > 0
    ? `Services supplémentaires :\n${bookingDetails.additionalServices
        .map(
          (s) =>
            `- ${s.name} (x${s.quantity}) : ${(s.price * s.quantity).toFixed(
              2
            )}€`
        )
        .join("\n")}\n\n`
    : ""
}${
    !bookingDetails.requiresPayment
      ? "Votre réservation sera confirmée. Vous recevrez un email de confirmation."
      : "Votre paiement a été effectué avec succès. À bientôt !"
  }

Pour toute question, contactez-nous :
Téléphone : 09 87 33 45 19
Email : strasbourg@coworkingcafe.fr

Coworking Café
1 rue de la Division Leclerc, 67000 Strasbourg
L-V: 09h-20h | S-D & JF: 10h-20h
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

export async function sendReservationConfirmed(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    startTime: string;
    endTime: string;
    numberOfPeople: number;
    totalPrice: number;
    confirmationNumber?: string;
    paymentStatus: string;
    invoiceOption?: boolean;
  }
): Promise<boolean> {
  const subject = "✅ Réservation confirmée - Coworking Café";

  const html = generateValidatedEmail({
    name: reservationDetails.name,
    spaceName: reservationDetails.spaceName,
    date: reservationDetails.date,
    startTime: reservationDetails.startTime,
    endTime: reservationDetails.endTime,
    numberOfPeople: reservationDetails.numberOfPeople,
    totalPrice: reservationDetails.totalPrice,
    confirmationNumber: reservationDetails.confirmationNumber,
  });

  const text = `
🎉 Réservation Confirmée !

Bonjour ${reservationDetails.name},

Bonne nouvelle ! Votre réservation a été confirmée.

✓ Réservation validée

Détails de votre réservation :
- Espace : ${reservationDetails.spaceName}
- Date : ${reservationDetails.date}
- Horaire : ${reservationDetails.startTime} - ${reservationDetails.endTime}
- Nombre de personnes : ${reservationDetails.numberOfPeople}
- Prix total : ${
    reservationDetails.totalPrice === 0
      ? "Sur devis"
      : reservationDetails.totalPrice.toFixed(2) + "€"
  }
${
  reservationDetails.confirmationNumber
    ? `- Numéro de confirmation : ${reservationDetails.confirmationNumber}`
    : ""
}

Nous avons hâte de vous accueillir ! 😊

Pour toute question :
Téléphone : 09 87 33 45 19
Email : strasbourg@coworkingcafe.fr

Coworking Café
1 rue de la Division Leclerc, 67000 Strasbourg
L-V: 09h-20h | S-D & JF: 10h-20h
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

export async function sendBookingReminder(
  email: string,
  bookingDetails: {
    name: string;
    spaceName: string;
    date: string;
    time: string;
  }
): Promise<boolean> {
  const subject = "Rappel : Votre réservation demain - Coworking Café";

  const html = generateReminderEmail({
    name: bookingDetails.name,
    spaceName: bookingDetails.spaceName,
    date: bookingDetails.date,
    time: bookingDetails.time,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export async function sendReservationCancelled(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    startTime: string;
    endTime: string;
    numberOfPeople: number;
    totalPrice: number;
    confirmationNumber?: string;
  }
): Promise<boolean> {
  const subject = "❌ Réservation annulée - Coworking Café";

  const html = generateReservationCancelledEmail({
    name: reservationDetails.name,
    spaceName: reservationDetails.spaceName,
    date: reservationDetails.date,
    startTime: reservationDetails.startTime,
    endTime: reservationDetails.endTime,
    numberOfPeople: reservationDetails.numberOfPeople,
    totalPrice: reservationDetails.totalPrice,
    confirmationNumber: reservationDetails.confirmationNumber,
  });

  const text = `
Réservation Annulée

Bonjour ${reservationDetails.name},

Nous vous informons que votre réservation a été annulée.

✗ Réservation annulée

Détails de la réservation annulée :
- Espace : ${reservationDetails.spaceName}
- Date : ${reservationDetails.date}
- Horaire : ${reservationDetails.startTime} - ${reservationDetails.endTime}
- Nombre de personnes : ${reservationDetails.numberOfPeople}
- Prix : ${reservationDetails.totalPrice.toFixed(2)}€
${
  reservationDetails.confirmationNumber
    ? `- Numéro de confirmation : ${reservationDetails.confirmationNumber}`
    : ""
}

Si vous avez effectué un paiement, un remboursement sera traité dans les meilleurs délais.

Si vous souhaitez effectuer une nouvelle réservation, n'hésitez pas à nous contacter ou à consulter notre site.

Pour toute question :
Téléphone : 09 87 33 45 19
Email : strasbourg@coworkingcafe.fr

Coworking Café
1 rue de la Division Leclerc, 67000 Strasbourg
L-V: 09h-20h | S-D & JF: 10h-20h
  `;

  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
}

export async function sendDepositHoldConfirmation(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    startTime: string;
    endTime: string;
    depositAmount: number;
    totalPrice: number;
  }
): Promise<boolean> {
  const subject = "Empreinte bancaire effectuée - Coworking Café";

  const html = generateDepositHoldEmail({
    name: reservationDetails.name,
    spaceName: reservationDetails.spaceName,
    date: reservationDetails.date,
    startTime: reservationDetails.startTime,
    endTime: reservationDetails.endTime,
    depositAmount: reservationDetails.depositAmount,
    totalPrice: reservationDetails.totalPrice,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export async function sendDepositCaptured(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    depositAmount: number;
  }
): Promise<boolean> {
  const subject = "Prélèvement effectué (no-show) - Coworking Café";

  const html = generateDepositCapturedEmail({
    name: reservationDetails.name,
    spaceName: reservationDetails.spaceName,
    date: reservationDetails.date,
    depositAmount: reservationDetails.depositAmount,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export async function sendDepositReleased(
  email: string,
  details: {
    name: string;
    spaceName: string;
    date: string;
    depositAmount: number;
  }
): Promise<boolean> {
  const subject = "Empreinte bancaire levée - Coworking Café";

  const html = generateDepositReleasedEmail({
    name: details.name,
    spaceName: details.spaceName,
    date: details.date,
    depositAmount: details.depositAmount,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export async function sendCardSavedConfirmation(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
  }
): Promise<boolean> {
  const subject = "Carte enregistrée - Paiement dans 7 jours - Coworking Café";

  const html = generateCardSavedEmail({
    name: reservationDetails.name,
    spaceName: reservationDetails.spaceName,
    date: reservationDetails.date,
    startTime: reservationDetails.startTime,
    endTime: reservationDetails.endTime,
    totalPrice: reservationDetails.totalPrice,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationConfirmation(
  email: string,
  cancellationDetails: {
    name: string;
    spaceName: string;
    date: string;
    startTime: string;
    endTime: string;
    cancellationFee: number;
    refundAmount: number;
    confirmationNumber?: string;
  }
): Promise<boolean> {
  const subject = "Confirmation d'annulation - Coworking Café";

  const html = generateCancellationEmail({
    name: cancellationDetails.name,
    spaceName: cancellationDetails.spaceName,
    date: cancellationDetails.date,
    startTime: cancellationDetails.startTime,
    endTime: cancellationDetails.endTime,
    confirmationNumber: cancellationDetails.confirmationNumber,
    cancellationFee: cancellationDetails.cancellationFee,
    refundAmount: cancellationDetails.refundAmount,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

/**
 * Send reservation rejected by admin email
 */
export async function sendReservationRejected(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    startTime: string;
    endTime: string;
    numberOfPeople: number;
    totalPrice: number;
    confirmationNumber: string;
    reason?: string;
  }
): Promise<boolean> {
  const subject = "❌ Demande de réservation refusée - Coworking Café";

  const html = generateReservationRejectedEmail({
    name: reservationDetails.name,
    spaceName: reservationDetails.spaceName,
    date: reservationDetails.date,
    startTime: reservationDetails.startTime,
    endTime: reservationDetails.endTime,
    numberOfPeople: reservationDetails.numberOfPeople,
    totalPrice: reservationDetails.totalPrice,
    confirmationNumber: reservationDetails.confirmationNumber,
    reason: reservationDetails.reason,
  });

  return sendEmail({
    to: email,
    subject,
    html,
  });
}
