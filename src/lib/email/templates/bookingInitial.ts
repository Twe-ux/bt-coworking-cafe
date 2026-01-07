/**
 * Template email : Confirmation initiale de réservation
 * Couleur : TEAL (#10B981)
 *
 * Pour modifier ce template, éditez directement ce fichier.
 */

export interface BookingInitialEmailData {
  name: string;
  spaceName: string;
  date: string;
  time: string;
  price: number;
  bookingId: string;
  requiresPayment: boolean;
  depositAmount?: number; // in cents
  captureMethod?: "manual" | "automatic";
  additionalServices?: string[];
  numberOfPeople?: number;
}

export function generateBookingInitialEmail(
  data: BookingInitialEmailData
): string {
  const bookingType = data.requiresPayment
    ? "réservation"
    : "demande de réservation";
  const depositInEuros = data.depositAmount
    ? (data.depositAmount / 100).toFixed(2)
    : null;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">

    <!-- Header ORANGE -->
    <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); color: white; padding: 30px 20px; text-align: center;">
      <h1 style="margin: 0 0 10px 0; font-size: 28px;">⏳ Réservation en attente de validation</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.95;">Votre réservation sera définitive après validation sous 24h</p>
    </div>

    <!-- Contenu -->
    <div style="padding: 30px 20px; line-height: 1.6; color: #333;">
      <p style="margin: 0 0 15px 0;">Bonjour <strong>${data.name}</strong>,</p>

      <p style="margin: 0 0 20px 0;">Nous avons bien reçu votre ${bookingType}. Vous trouverez ci-dessous tous les détails.</p>

      <!-- Détails de la réservation -->
      <div style="background: linear-gradient(to bottom, #f8f9fa 0%, #ffffff 100%); padding: 25px; border-radius: 12px; margin: 20px 0; border: 1px solid #e5e7eb;">
        <h3 style="margin: 0 0 20px 0; color: #10B981; font-size: 20px; border-bottom: 2px solid #10B981; padding-bottom: 10px;">📋 Détails de votre réservation</h3>

        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 0; font-weight: 600; color: #6b7280 !important;">📍 Espace</td>
            <td style="padding: 12px 0; text-align: right; color: #111827 !important; font-weight: 500;">${
              data.spaceName
            }</td>
          </tr>
          ${
            data.numberOfPeople
              ? `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 0; font-weight: 600; color: #6b7280 !important;">👥 Nombre de personnes</td>
            <td style="padding: 12px 0; text-align: right; color: #111827 !important; font-weight: 500;">${data.numberOfPeople}</td>
          </tr>
          `
              : ""
          }
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 0; font-weight: 600; color: #6b7280 !important;">📅 Date</td>
            <td style="padding: 12px 0; text-align: right; color: #111827 !important; font-weight: 500;">${
              data.date
            }</td>
          </tr>
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 0; font-weight: 600; color: #6b7280 !important;">🕐 Horaire</td>
            <td style="padding: 12px 0; text-align: right; color: #111827 !important; font-weight: 500;">${
              data.time
            }</td>
          </tr>
          ${
            data.depositAmount
              ? `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 12px 0; font-weight: 600; color: #6b7280 !important;">💳 Empreinte</td>
            <td style="padding: 12px 0; text-align: right; color: #111827 !important; font-weight: 500;">${depositInEuros}€</td>
          </tr>
          `
              : ""
          }
          <tr style="background: #f0fdf4;">
            <td style="padding: 15px 0; font-weight: 700; color: #065F46 !important; font-size: 16px;">💰 Prix total</td>
            <td style="padding: 15px 0; text-align: right; color: #065F46 !important; font-weight: bold; font-size: 22px;">${data.price.toFixed(
              2
            )}€</td>
          </tr>
        </table>

        ${
          data.additionalServices && data.additionalServices.length > 0
            ? `
        <div style="padding: 10px 0;">
          <span style="font-weight: 600; color: #6b7280; display: block; margin-bottom: 8px;">Services supplémentaires</span>
          <ul style="margin: 0; padding-left: 20px; color: #111827;">
            ${data.additionalServices
              .map((service) => `<li style="padding: 3px 0;">${service}</li>`)
              .join("")}
          </ul>
        </div>
        `
            : ""
        }
      </div>

      ${
        data.depositAmount
          ? `
      <!-- Info Box Empreinte Bancaire -->
      <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #1E40AF;"><strong>💳 Empreinte bancaire effectuée</strong></p>
        <p style="margin: 8px 0 0 0; color: #1E40AF; font-size: 14px;">
          Une empreinte bancaire de <strong>${depositInEuros}€</strong> soit <strong>${Math.round(
              (data.depositAmount / (data.price * 100)) * 100
            )}%</strong> du montant de la réservation a été effectuée sur votre carte. Cette empreinte sera automatiquement annulée le jour de votre présence lors de votre règlement sur place. <br /> Si toutefois, vous annulez votre réservation ou ne vous présentez pas le jour de votre réservation, des frais d'annulation seront débités selon nos <a href="https://coworkingcafe.fr/CGU" style="color: #1E40AF; text-decoration: underline; font-weight: 600;">CGVs</a>.
        </p>
      </div>
      `
          : !data.requiresPayment
          ? `
      <!-- Info Box Confirmation -->
      <div style="background: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0; color: #1E40AF;"><strong>⏳ Réservation en attente de confirmation</strong></p>
        <p style="margin: 8px 0 0 0; color: #1E40AF; font-size: 14px;">
          Votre réservation sera confirmée sous 24h. Vous recevrez un email de confirmation dès validation.
        </p>
      </div>
      `
          : ""
      }

      <!-- Contact -->
      <p style="margin: 25px 0 10px 0;"><strong>Pour toute question, n'hésitez pas à nous contacter :</strong></p>
      <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
        <li style="padding: 5px 0;">📞 Téléphone : 09 87 33 45 19</li>
        <li style="padding: 5px 0;">📧 Email : strasbourg@coworkingcafe.fr</li>
      </ul>

      <p style="margin: 25px 0 0 0;">À bientôt dans nos locaux,<br><strong>L'équipe Coworking Café</strong></p>
    </div>

    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
      <p style="margin: 0;"><strong>Coworking Café</strong></p>
      <p style="margin: 5px 0 0 0;">1 rue de la Division Leclerc, 67000 Strasbourg</p>
      <p style="margin: 5px 0 0 0;">L-V: 09h-20h | S-D & JF: 10h-20h</p>
    </div>
  </div>
</body>
</html>
  `;
}
