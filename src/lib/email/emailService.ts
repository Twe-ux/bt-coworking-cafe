/**
 * Email Service
 *
 * This is a placeholder for email functionality.
 * To enable emails, install nodemailer:
 * npm install nodemailer @types/nodemailer
 *
 * Then configure SMTP settings in .env.local:
 * EMAIL_HOST=smtp.gmail.com
 * EMAIL_PORT=587
 * EMAIL_USER=your-email@gmail.com
 * EMAIL_PASSWORD=your-app-password
 * EMAIL_FROM=Coworking Café <noreply@coworkingcafe.fr>
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // TODO: Implement actual email sending with nodemailer
  console.log("📧 Email would be sent:", {
    to: options.to,
    subject: options.subject,
  });

  // Placeholder - return true for now
  return true;

  /*
  // Uncomment when nodemailer is installed and configured:

  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
  */
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
                <strong>Prix :</strong>
                <span>${bookingDetails.price.toFixed(2)}€</span>
              </div>
              <div class="detail-row">
                <strong>Numéro de réservation :</strong>
                <span>${bookingDetails.bookingId}</span>
              </div>
            </div>

            ${
              !bookingDetails.requiresPayment
                ? '<p><strong>Note :</strong> Votre réservation sera confirmée sous 24h. Vous recevrez un email de confirmation.</p>'
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
