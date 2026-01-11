/**
 * Email template for deposit released notification
 * Sent when a deposit hold is released (e.g., when reservation is marked as present)
 */

interface DepositReleasedData {
  name: string;
  spaceName: string;
  date: string;
  depositAmount: number;
}

export function generateDepositReleasedEmail(data: DepositReleasedData): string {
  const { name, spaceName, date, depositAmount } = data;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Empreinte bancaire levée</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #588983 0%, #417972 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">✅ Empreinte bancaire levée</h1>
  </div>

  <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">

    <p style="font-size: 16px; margin-bottom: 20px;">Bonjour ${name},</p>

    <div style="background-color: white; border-left: 4px solid #417972; padding: 20px; margin: 20px 0; border-radius: 5px;">
      <p style="margin: 0; font-size: 16px;">
        Bonne nouvelle ! L'empreinte bancaire de <strong>${depositAmount.toFixed(2)} €</strong> pour votre réservation a été levée.
      </p>
    </div>

    <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #417972; margin-top: 0; font-size: 20px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">Détails de la réservation</h2>

      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; color: #6c757d; width: 40%;">Espace :</td>
          <td style="padding: 10px 0; font-weight: 600;">${spaceName}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6c757d;">Date :</td>
          <td style="padding: 10px 0; font-weight: 600;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6c757d;">Montant libéré :</td>
          <td style="padding: 10px 0; font-weight: 600; color: #28a745;">${depositAmount.toFixed(2)} €</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; font-size: 14px;">
        <strong>ℹ️ Information :</strong> L'empreinte bancaire a été automatiquement levée car vous avez été marqué(e) comme présent(e) à votre réservation. Aucun montant n'a été débité de votre carte.
      </p>
    </div>

    <p style="font-size: 14px; color: #6c757d; margin-top: 30px;">
      Merci d'avoir choisi notre espace de coworking !
    </p>

    <p style="font-size: 14px; color: #6c757d; margin-top: 20px;">
      Cordialement,<br>
      <strong>L'équipe Cow-orking Café</strong>
    </p>

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6; text-align: center;">
      <p style="font-size: 12px; color: #6c757d; margin: 5px 0;">
        Cow-orking Café by Anticafé Strasbourg
      </p>
      <p style="font-size: 12px; color: #6c757d; margin: 5px 0;">
        1 rue de la Division Leclerc, 67000 Strasbourg
      </p>
    </div>

  </div>

</body>
</html>
  `.trim();
}
