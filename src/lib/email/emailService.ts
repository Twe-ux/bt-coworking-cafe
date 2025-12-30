/**
 * Email Service using Resend
 *
 * Configure in .env.local:
 * RESEND_API_KEY=re_...
 * RESEND_FROM_EMAIL=Coworking Café <noreply@coworkingcafe.fr>
 */

import { Resend } from "resend";

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

    console.log("✅ Email sent successfully to:", options.to);
    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error);
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
    captureMethod?: 'manual' | 'automatic';
    additionalServices?: Array<{ name: string; quantity: number; price: number }>;
  }
): Promise<boolean> {
  const subject = "Confirmation de réservation - Coworking Café";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #417972; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .button { display: inline-block; background: #f2d381; color: #142220; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Coworking Café</h1>
            <p>Confirmation de réservation</p>
          </div>

          <div class="content">
            <h2>Bonjour ${bookingDetails.name},</h2>
            <p>Nous avons bien reçu votre ${bookingDetails.requiresPayment ? 'réservation' : 'demande de réservation'}.</p>

            <div class="details">
              <h3>Détails de votre réservation</h3>
              <div class="detail-row">
                <strong>Espace :</strong>
                <span>${bookingDetails.spaceName}</span>
              </div>
              <div class="detail-row">
                <strong>Date :</strong>
                <span>${bookingDetails.date}</span>
              </div>
              <div class="detail-row">
                <strong>Heure :</strong>
                <span>${bookingDetails.time}</span>
              </div>
              <div class="detail-row">
                <strong>Prix total :</strong>
                <span>${bookingDetails.price.toFixed(2)}€</span>
              </div>
              ${
                bookingDetails.depositAmount && bookingDetails.requiresPayment
                  ? `<div class="detail-row" style="background-color: #fff3cd; margin: 10px -20px; padding: 10px 20px;">
                      <strong>Empreinte bancaire :</strong>
                      <span>${(bookingDetails.depositAmount / 100).toFixed(2)}€</span>
                    </div>`
                  : ''
              }
              <div class="detail-row">
                <strong>Numéro de réservation :</strong>
                <span>${bookingDetails.bookingId}</span>
              </div>
            </div>

            ${
              bookingDetails.additionalServices && bookingDetails.additionalServices.length > 0
                ? `<div class="details">
                    <h3>Services supplémentaires</h3>
                    ${bookingDetails.additionalServices
                      .map(
                        (service) => `
                      <div class="detail-row">
                        <span>${service.name} (x${service.quantity})</span>
                        <span>${(service.price * service.quantity).toFixed(2)}€</span>
                      </div>
                    `
                      )
                      .join("")}
                  </div>`
                : ""
            }

            ${
              !bookingDetails.requiresPayment
                ? '<p><strong>Note :</strong> Votre réservation sera confirmée sous 24h. Vous recevrez un email de confirmation.</p>'
                : bookingDetails.depositAmount && bookingDetails.captureMethod === 'manual'
                ? `<div style="background-color: #d1ecf1; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>💳 Empreinte bancaire</strong></p>
                    <p style="margin: 10px 0 0 0;">Une empreinte bancaire de <strong>${(bookingDetails.depositAmount / 100).toFixed(2)}€</strong> a été effectuée sur votre carte. Cette empreinte sera annulée si vous vous présentez à votre réservation, ou encaissée en cas de non-présentation.</p>
                  </div>`
                : bookingDetails.depositAmount && bookingDetails.captureMethod === 'automatic'
                ? `<div style="background-color: #d1ecf1; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0;"><strong>💳 Paiement programmé</strong></p>
                    <p style="margin: 10px 0 0 0;">Votre carte a été enregistrée. Un paiement de <strong>${(bookingDetails.depositAmount / 100).toFixed(2)}€</strong> sera effectué 7 jours avant votre réservation.</p>
                  </div>`
                : '<p><strong>Note :</strong> Votre paiement a été effectué avec succès. À bientôt !</p>'
            }

            <p>Pour toute question, n'hésitez pas à nous contacter :</p>
            <ul>
              <li>📞 Téléphone : 09 87 33 45 19</li>
              <li>📧 Email : strasbourg@coworkingcafe.fr</li>
            </ul>
          </div>

          <div class="footer">
            <p>Coworking Café - 1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Bonjour ${bookingDetails.name},

Nous avons bien reçu votre ${bookingDetails.requiresPayment ? 'réservation' : 'demande de réservation'}.

Détails de votre réservation :
- Espace : ${bookingDetails.spaceName}
- Date : ${bookingDetails.date}
- Heure : ${bookingDetails.time}
- Prix : ${bookingDetails.price.toFixed(2)}€
- Numéro de réservation : ${bookingDetails.bookingId}

${
    bookingDetails.additionalServices && bookingDetails.additionalServices.length > 0
      ? `Services supplémentaires :\n${bookingDetails.additionalServices
          .map((s) => `- ${s.name} (x${s.quantity}) : ${(s.price * s.quantity).toFixed(2)}€`)
          .join('\n')}\n\n`
      : ''
  }${
    !bookingDetails.requiresPayment
      ? 'Votre réservation sera confirmée sous 24h. Vous recevrez un email de confirmation.'
      : 'Votre paiement a été effectué avec succès. À bientôt !'
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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .success-badge { background: #10B981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Réservation Confirmée !</h1>
          </div>

          <div class="content">
            <h2>Bonjour ${reservationDetails.name},</h2>
            <p>Bonne nouvelle ! Votre réservation a été confirmée.</p>

            <div class="success-badge">
              ✓ Réservation validée
            </div>

            <div class="details">
              <h3 style="margin-top: 0; color: #10B981;">Détails de votre réservation</h3>
              <div class="detail-row">
                <strong>Espace :</strong>
                <span>${reservationDetails.spaceName}</span>
              </div>
              <div class="detail-row">
                <strong>Date :</strong>
                <span>${reservationDetails.date}</span>
              </div>
              <div class="detail-row">
                <strong>Horaire :</strong>
                <span>${reservationDetails.startTime} - ${reservationDetails.endTime}</span>
              </div>
              <div class="detail-row">
                <strong>Nombre de personnes :</strong>
                <span>${reservationDetails.numberOfPeople}</span>
              </div>
              <div class="detail-row">
                <strong>Prix total :</strong>
                <span style="color: ${reservationDetails.totalPrice === 0 ? '#F59E0B' : '#10B981'}; font-weight: 600;">${reservationDetails.totalPrice === 0 ? 'Sur devis' : reservationDetails.totalPrice.toFixed(2) + '€'}</span>
              </div>
              ${
                reservationDetails.confirmationNumber
                  ? `<div class="detail-row">
                      <strong>Numéro de confirmation :</strong>
                      <span><code>${reservationDetails.confirmationNumber}</code></span>
                    </div>`
                  : ""
              }
              <div class="detail-row">
                <strong>Statut du paiement :</strong>
                <span>${
                  reservationDetails.paymentStatus === "paid"
                    ? "✅ Payé"
                    : reservationDetails.paymentStatus === "partial"
                    ? "⚠️ Paiement partiel"
                    : reservationDetails.invoiceOption
                    ? "📄 Sur facture"
                    : "⏳ En attente"
                }</span>
              </div>
            </div>

            ${
              reservationDetails.invoiceOption
                ? `<div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 4px; margin: 20px 0;">
                    <p style="margin: 0; color: #92400E;"><strong>📄 Paiement sur facture</strong></p>
                    <p style="margin: 8px 0 0 0; color: #92400E; font-size: 14px;">Vous avez choisi le paiement sur facture. Une facture vous sera envoyée prochainement.</p>
                  </div>`
                : ""
            }

            <p><strong>Prochaines étapes :</strong></p>
            <ul>
              <li>Présentez-vous à l'accueil le jour de votre réservation</li>
              ${reservationDetails.invoiceOption ? '<li>Vous recevrez une facture par email dans les prochains jours</li>' : ''}
              <li>N'hésitez pas à nous contacter si vous avez des questions</li>
            </ul>

            <p style="margin-top: 30px;">Nous avons hâte de vous accueillir ! 😊</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p><strong>Pour toute question :</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📞 Téléphone : <a href="tel:0987334519">09 87 33 45 19</a></li>
              <li>📧 Email : <a href="mailto:strasbourg@coworkingcafe.fr">strasbourg@coworkingcafe.fr</a></li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Coworking Café</strong></p>
            <p>1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

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
- Prix total : ${reservationDetails.totalPrice === 0 ? 'Sur devis' : reservationDetails.totalPrice.toFixed(2) + '€'}
${
    reservationDetails.confirmationNumber
      ? `- Numéro de confirmation : ${reservationDetails.confirmationNumber}`
      : ""
  }
- Statut du paiement : ${
    reservationDetails.paymentStatus === "paid"
      ? "Payé"
      : reservationDetails.paymentStatus === "partial"
      ? "Paiement partiel"
      : reservationDetails.invoiceOption
      ? "Sur facture"
      : "En attente"
  }

${
    reservationDetails.invoiceOption
      ? `📄 PAIEMENT SUR FACTURE
Vous avez choisi le paiement sur facture. Une facture vous sera envoyée prochainement.

`
      : ""
  }Prochaines étapes :
- Présentez-vous à l'accueil le jour de votre réservation
${reservationDetails.invoiceOption ? '- Vous recevrez une facture par email dans les prochains jours\n' : ''}- N'hésitez pas à nous contacter si vous avez des questions

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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #417972; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .highlight { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Coworking Café</h1>
            <p>Rappel de réservation</p>
          </div>

          <div class="content">
            <h2>Bonjour ${bookingDetails.name},</h2>
            <p>Nous vous rappelons que vous avez une réservation demain :</p>

            <div class="highlight">
              <p><strong>Espace :</strong> ${bookingDetails.spaceName}</p>
              <p><strong>Date :</strong> ${bookingDetails.date}</p>
              <p><strong>Heure :</strong> ${bookingDetails.time}</p>
            </div>

            <p>Nous serons ravis de vous accueillir ! À demain 😊</p>

            <p>L'équipe du Coworking Café</p>
          </div>
        </div>
      </body>
    </html>
  `;

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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .cancelled-badge { background: #EF4444; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Réservation Annulée</h1>
          </div>

          <div class="content">
            <h2>Bonjour ${reservationDetails.name},</h2>
            <p>Nous vous informons que votre réservation a été annulée.</p>

            <div class="cancelled-badge">
              ✗ Réservation annulée
            </div>

            <div class="details">
              <h3 style="margin-top: 0; color: #EF4444;">Détails de la réservation annulée</h3>
              <div class="detail-row">
                <strong>Espace :</strong>
                <span>${reservationDetails.spaceName}</span>
              </div>
              <div class="detail-row">
                <strong>Date :</strong>
                <span>${reservationDetails.date}</span>
              </div>
              <div class="detail-row">
                <strong>Horaire :</strong>
                <span>${reservationDetails.startTime} - ${reservationDetails.endTime}</span>
              </div>
              <div class="detail-row">
                <strong>Nombre de personnes :</strong>
                <span>${reservationDetails.numberOfPeople}</span>
              </div>
              <div class="detail-row">
                <strong>Prix :</strong>
                <span>${reservationDetails.totalPrice.toFixed(2)}€</span>
              </div>
              ${
                reservationDetails.confirmationNumber
                  ? `<div class="detail-row">
                      <strong>Numéro de confirmation :</strong>
                      <span><code>${reservationDetails.confirmationNumber}</code></span>
                    </div>`
                  : ""
              }
            </div>

            <p>Si vous avez effectué un paiement, un remboursement sera traité dans les meilleurs délais.</p>

            <p>Si vous souhaitez effectuer une nouvelle réservation, n'hésitez pas à nous contacter ou à consulter notre site.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p><strong>Pour toute question :</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📞 Téléphone : <a href="tel:0987334519">09 87 33 45 19</a></li>
              <li>📧 Email : <a href="mailto:strasbourg@coworkingcafe.fr">strasbourg@coworkingcafe.fr</a></li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Coworking Café</strong></p>
            <p>1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .info-box { background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Empreinte bancaire confirmée</h1>
          </div>

          <div class="content">
            <h2>Bonjour ${reservationDetails.name},</h2>
            <p>Une empreinte bancaire de <strong>${reservationDetails.depositAmount.toFixed(2)}€</strong> a été effectuée pour garantir votre réservation.</p>

            <div class="info-box">
              <p style="margin: 0; color: #1E40AF;"><strong>ℹ️ Comment fonctionne l'empreinte bancaire ?</strong></p>
              <ul style="margin: 8px 0 0 0; color: #1E40AF; font-size: 14px;">
                <li><strong>Si vous vous présentez</strong> : l'empreinte sera <span style="color: #10B981;">automatiquement annulée</span></li>
                <li><strong>En cas de no-show</strong> : l'empreinte sera <span style="color: #EF4444;">encaissée</span></li>
              </ul>
            </div>

            <div class="details">
              <h3 style="margin-top: 0;">Détails de votre réservation</h3>
              <p><strong>Espace :</strong> ${reservationDetails.spaceName}</p>
              <p><strong>Date :</strong> ${reservationDetails.date}</p>
              <p><strong>Horaire :</strong> ${reservationDetails.startTime} - ${reservationDetails.endTime}</p>
              <p><strong>Prix total :</strong> ${reservationDetails.totalPrice.toFixed(2)}€</p>
              <p><strong>Empreinte :</strong> ${reservationDetails.depositAmount.toFixed(2)}€</p>
            </div>

            <p>Nous avons hâte de vous accueillir ! 😊</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p><strong>Pour toute question :</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📞 Téléphone : <a href="tel:0987334519">09 87 33 45 19</a></li>
              <li>📧 Email : <a href="mailto:strasbourg@coworkingcafe.fr">strasbourg@coworkingcafe.fr</a></li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Coworking Café</strong></p>
            <p>1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export async function sendDepositReleased(
  email: string,
  reservationDetails: {
    name: string;
    spaceName: string;
    date: string;
    depositAmount: number;
  }
): Promise<boolean> {
  const subject = "✅ Empreinte bancaire annulée - Coworking Café";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10B981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .success-box { background: #D1FAE5; border-left: 4px solid #10B981; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Empreinte annulée</h1>
          </div>

          <div class="content">
            <h2>Bonjour ${reservationDetails.name},</h2>
            <p>Merci de vous être présenté(e) ! 🎉</p>

            <div class="success-box">
              <p style="margin: 0; color: #065F46;"><strong>L'empreinte bancaire de ${reservationDetails.depositAmount.toFixed(2)}€ a été annulée.</strong></p>
              <p style="margin: 8px 0 0 0; color: #065F46; font-size: 14px;">Aucun montant ne sera débité de votre compte.</p>
            </div>

            <p>Nous espérons vous revoir bientôt au Coworking Café ! 😊</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p><strong>Pour toute question :</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📞 Téléphone : <a href="tel:0987334519">09 87 33 45 19</a></li>
              <li>📧 Email : <a href="mailto:strasbourg@coworkingcafe.fr">strasbourg@coworkingcafe.fr</a></li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Coworking Café</strong></p>
            <p>1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .warning-box { background: #FEE2E2; border-left: 4px solid #EF4444; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Prélèvement effectué</h1>
          </div>

          <div class="content">
            <h2>Bonjour ${reservationDetails.name},</h2>
            <p>Nous constatons que vous ne vous êtes pas présenté(e) pour votre réservation du ${reservationDetails.date}.</p>

            <div class="warning-box">
              <p style="margin: 0; color: #991B1B;"><strong>L'empreinte bancaire de ${reservationDetails.depositAmount.toFixed(2)}€ a été encaissée.</strong></p>
              <p style="margin: 8px 0 0 0; color: #991B1B; font-size: 14px;">Conformément à nos conditions, le montant de l'empreinte a été prélevé suite au no-show.</p>
            </div>

            <p><strong>Détails :</strong></p>
            <ul>
              <li>Espace : ${reservationDetails.spaceName}</li>
              <li>Date : ${reservationDetails.date}</li>
              <li>Montant prélevé : ${reservationDetails.depositAmount.toFixed(2)}€</li>
            </ul>

            <p>Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter dans les plus brefs délais.</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p><strong>Pour toute question :</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📞 Téléphone : <a href="tel:0987334519">09 87 33 45 19</a></li>
              <li>📧 Email : <a href="mailto:strasbourg@coworkingcafe.fr">strasbourg@coworkingcafe.fr</a></li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Coworking Café</strong></p>
            <p>1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

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

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; }
          .info-box { background: #EDE9FE; border-left: 4px solid #8B5CF6; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; background: #f3f4f6; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Carte enregistrée</h1>
          </div>

          <div class="content">
            <h2>Bonjour ${reservationDetails.name},</h2>
            <p>Votre carte bancaire a été enregistrée avec succès pour votre réservation.</p>

            <div class="info-box">
              <p style="margin: 0; color: #5B21B6;"><strong>ℹ️ Quand serai-je débité(e) ?</strong></p>
              <p style="margin: 8px 0 0 0; color: #5B21B6; font-size: 14px;">
                Le paiement de <strong>${reservationDetails.totalPrice.toFixed(2)}€</strong> sera effectué <strong>7 jours avant</strong> votre réservation.
                <br>Vous recevrez un email de confirmation avant le prélèvement.
              </p>
            </div>

            <div class="details">
              <h3 style="margin-top: 0;">Détails de votre réservation</h3>
              <p><strong>Espace :</strong> ${reservationDetails.spaceName}</p>
              <p><strong>Date :</strong> ${reservationDetails.date}</p>
              <p><strong>Horaire :</strong> ${reservationDetails.startTime} - ${reservationDetails.endTime}</p>
              <p><strong>Prix total :</strong> ${reservationDetails.totalPrice.toFixed(2)}€</p>
            </div>

            <p><strong>Annulation :</strong> Vous pouvez annuler gratuitement jusqu'à 7 jours avant la date de réservation.</p>

            <p>Nous avons hâte de vous accueillir ! 😊</p>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

            <p><strong>Pour toute question :</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>📞 Téléphone : <a href="tel:0987334519">09 87 33 45 19</a></li>
              <li>📧 Email : <a href="mailto:strasbourg@coworkingcafe.fr">strasbourg@coworkingcafe.fr</a></li>
            </ul>
          </div>

          <div class="footer">
            <p><strong>Coworking Café</strong></p>
            <p>1 rue de la Division Leclerc, 67000 Strasbourg</p>
            <p>L-V: 09h-20h | S-D & JF: 10h-20h</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}
