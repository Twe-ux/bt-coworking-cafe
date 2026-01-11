'use client';

import { useState } from 'react';

export default function EmailPreviewPage() {
  const [selectedEmail, setSelectedEmail] = useState<string>('pending');

  const mockData = {
    name: "Jean Dupont",
    spaceName: "Salle Verrière",
    date: "15 janvier 2026",
    startTime: "14:00",
    endTime: "18:00",
    numberOfPeople: 4,
    totalPrice: 85.00,
    depositAmount: 85.00,
    confirmationNumber: "BT-2026-001234",
    email: "jean.dupont@example.com"
  };

  const emailTemplates = {
    pending: {
      title: "Demande en attente de validation",
      subject: "⏳ Demande de réservation reçue - En attente de validation",
      html: getPendingEmailHTML(mockData)
    },
    confirmed: {
      title: "Réservation confirmée",
      subject: "✅ Réservation confirmée - Coworking Café",
      html: getConfirmedEmailHTML(mockData)
    },
    showedUp: {
      title: "Présence confirmée - Empreinte libérée",
      subject: "✅ Merci de votre visite - Empreinte bancaire annulée",
      html: getShowedUpEmailHTML(mockData)
    },
    noShow: {
      title: "Non-présentation - Empreinte encaissée",
      subject: "⚠️ Absence constatée - Empreinte bancaire encaissée",
      html: getNoShowEmailHTML(mockData)
    },
    cancelled: {
      title: "Annulation par le commerce",
      subject: "❌ Annulation de réservation - Empreinte libérée",
      html: getCancelledEmailHTML(mockData)
    }
  };

  return (
    <section className="email-preview-page py-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="booking-card sticky-top" style={{ top: "20px" }}>
              <h2 className="h5 mb-4 fw-semibold">📧 Templates Email</h2>
              <div className="d-flex flex-column gap-2">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedEmail(key)}
                    className={`btn ${selectedEmail === key ? 'btn-success' : 'btn-outline-success'} text-start`}
                    style={{ fontSize: "0.875rem" }}
                  >
                    {template.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="booking-card mb-4">
              <h1 className="h4 mb-2 fw-semibold">{emailTemplates[selectedEmail as keyof typeof emailTemplates].title}</h1>
              <p className="text-muted mb-0" style={{ fontSize: "0.875rem" }}>
                <strong>Sujet:</strong> {emailTemplates[selectedEmail as keyof typeof emailTemplates].subject}
              </p>
            </div>

            <div className="booking-card" style={{ padding: 0, overflow: "hidden" }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: emailTemplates[selectedEmail as keyof typeof emailTemplates].html
                }}
                style={{
                  background: "#f9fafb",
                  minHeight: "600px"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 1. Email de prise en compte - En attente de validation
function getPendingEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #588983 0%, #3d615c 100%); padding: 40px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      ⏳ Demande Reçue
                    </h1>
                    <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 15px;">
                      Coworking Café by Anticafé
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                      Bonjour ${data.name},
                    </h2>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Nous avons bien reçu votre demande de réservation. Celle-ci est actuellement <strong style="color: #f59e0b;">en attente de validation</strong> par notre équipe.
                    </p>

                    <!-- Status Badge -->
                    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 6px; margin-bottom: 32px;">
                      <p style="margin: 0; color: #92400e; font-size: 14px; font-weight: 600;">
                        📋 Statut : En attente de validation
                      </p>
                      <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                        Vous recevrez un email de confirmation dès que votre réservation sera validée (généralement sous 24h).
                      </p>
                    </div>

                    <!-- Booking Details -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                      <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #588983;">
                        📋 Détails de votre demande
                      </h3>

                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Espace</td>
                          <td style="font-size: 14px; color: #111827; font-weight: 600; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.spaceName}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Date</td>
                          <td style="font-size: 14px; color: #111827; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">📅 ${data.date}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Horaire</td>
                          <td style="font-size: 14px; color: #111827; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">🕐 ${data.startTime} - ${data.endTime}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Personnes</td>
                          <td style="font-size: 14px; color: #111827; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">👥 ${data.numberOfPeople}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 12px 0 0 0; font-weight: 600;">Total</td>
                          <td style="font-size: 18px; color: #588983; font-weight: 700; padding: 12px 0 0 0; text-align: right;">${data.totalPrice.toFixed(2)}€</td>
                        </tr>
                      </table>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Notre équipe examine votre demande et vous contactera rapidement pour confirmer votre réservation.
                    </p>

                    <!-- Contact -->
                    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
                        💬 Questions ?
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.6;">
                        📞 <a href="tel:0987334519" style="color: #166534; text-decoration: none;">09 87 33 45 19</a><br>
                        📧 <a href="mailto:strasbourg@coworkingcafe.fr" style="color: #166534; text-decoration: none;">strasbourg@coworkingcafe.fr</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111827;">
                      Coworking Café by Anticafé
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">
                      1 rue de la Division Leclerc, 67000 Strasbourg
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">
                      L-V: 09h-20h | S-D & JF: 10h-20h
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// 2. Email de confirmation après validation
function getConfirmedEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #588983 0%, #3d615c 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">✅</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Réservation Confirmée !
                    </h1>
                    <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 15px;">
                      Coworking Café by Anticafé
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                      Bonjour ${data.name},
                    </h2>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Excellente nouvelle ! Votre réservation a été <strong style="color: #588983;">validée et confirmée</strong>. Nous avons hâte de vous accueillir ! 🎉
                    </p>

                    <!-- Confirmation Number -->
                    <div style="background: #f0fdf4; border: 2px solid #588983; padding: 20px; border-radius: 8px; margin-bottom: 32px; text-align: center;">
                      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                        Numéro de confirmation
                      </p>
                      <p style="margin: 0; color: #588983; font-size: 24px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 1px;">
                        ${data.confirmationNumber}
                      </p>
                      <p style="margin: 12px 0 0 0; color: #6b7280; font-size: 12px;">
                        Conservez ce numéro précieusement
                      </p>
                    </div>

                    <!-- Booking Details -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                      <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #588983;">
                        📋 Détails de votre réservation
                      </h3>

                      <table width="100%" cellpadding="8" cellspacing="0">
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Espace</td>
                          <td style="font-size: 14px; color: #111827; font-weight: 600; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">${data.spaceName}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Date</td>
                          <td style="font-size: 14px; color: #111827; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">📅 ${data.date}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Horaire</td>
                          <td style="font-size: 14px; color: #111827; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">🕐 ${data.startTime} - ${data.endTime}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">Personnes</td>
                          <td style="font-size: 14px; color: #111827; padding: 8px 0; text-align: right; border-bottom: 1px solid #e5e7eb;">👥 ${data.numberOfPeople}</td>
                        </tr>
                        <tr>
                          <td style="font-size: 14px; color: #6b7280; padding: 12px 0 0 0; font-weight: 600;">Total</td>
                          <td style="font-size: 18px; color: #588983; font-weight: 700; padding: 12px 0 0 0; text-align: right;">${data.totalPrice.toFixed(2)}€</td>
                        </tr>
                      </table>
                    </div>

                    <!-- Bank Hold Info -->
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                        💳 Empreinte bancaire : ${data.depositAmount.toFixed(2)}€
                      </p>
                      <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
                        <span style="color: #10b981;">✓ Si vous vous présentez :</span> l'empreinte sera automatiquement annulée<br>
                        <span style="color: #ef4444;">✗ En cas de no-show :</span> l'empreinte sera encaissée
                      </p>
                    </div>

                    <!-- Next Steps -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
                        📝 Avant votre visite :
                      </p>
                      <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4b5563; line-height: 1.8;">
                        <li>Présentez-vous à l'accueil avec votre numéro de confirmation</li>
                        <li>Arrivez 5 minutes avant le début de votre créneau</li>
                        <li>En cas d'annulation, prévenez-nous au moins 24h à l'avance</li>
                      </ul>
                    </div>

                    <!-- Contact -->
                    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
                        💬 Questions ?
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.6;">
                        📞 <a href="tel:0987334519" style="color: #166534; text-decoration: none;">09 87 33 45 19</a><br>
                        📧 <a href="mailto:strasbourg@coworkingcafe.fr" style="color: #166534; text-decoration: none;">strasbourg@coworkingcafe.fr</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111827;">
                      Coworking Café by Anticafé
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">
                      1 rue de la Division Leclerc, 67000 Strasbourg
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">
                      L-V: 09h-20h | S-D & JF: 10h-20h
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// 3. Email de présence confirmée - Empreinte libérée
function getShowedUpEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Merci de votre visite !
                    </h1>
                    <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 15px;">
                      Empreinte bancaire annulée
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                      Bonjour ${data.name},
                    </h2>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Merci de vous être présenté(e) ! Nous espérons que vous avez passé un agréable moment au Coworking Café. 😊
                    </p>

                    <!-- Success Badge -->
                    <div style="background: #d1fae5; border: 2px solid #10b981; padding: 24px; border-radius: 8px; margin-bottom: 32px; text-align: center;">
                      <div style="font-size: 36px; margin-bottom: 12px;">✅</div>
                      <p style="margin: 0 0 8px 0; color: #065f46; font-size: 18px; font-weight: 700;">
                        Empreinte bancaire annulée
                      </p>
                      <p style="margin: 0; color: #065f46; font-size: 24px; font-weight: 700;">
                        ${data.depositAmount.toFixed(2)}€
                      </p>
                      <p style="margin: 12px 0 0 0; color: #065f46; font-size: 13px;">
                        Aucun montant ne sera débité de votre compte
                      </p>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      L'empreinte bancaire de <strong>${data.depositAmount.toFixed(2)}€</strong> qui avait été effectuée pour garantir votre réservation a été <strong style="color: #10b981;">automatiquement annulée</strong>.
                    </p>

                    <!-- Booking Summary -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
                        📋 Récapitulatif de votre visite
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.8;">
                        <strong>Espace :</strong> ${data.spaceName}<br>
                        <strong>Date :</strong> ${data.date}<br>
                        <strong>Horaire :</strong> ${data.startTime} - ${data.endTime}
                      </p>
                    </div>

                    <!-- Feedback -->
                    <div style="background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                      <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                        <strong>💡 Votre avis compte !</strong><br>
                        N'hésitez pas à nous faire part de vos retours pour nous aider à améliorer notre service.
                      </p>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Nous serions ravis de vous revoir prochainement au Coworking Café ! 🙌
                    </p>

                    <!-- Contact -->
                    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
                        💬 Restons en contact
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.6;">
                        📞 <a href="tel:0987334519" style="color: #166534; text-decoration: none;">09 87 33 45 19</a><br>
                        📧 <a href="mailto:strasbourg@coworkingcafe.fr" style="color: #166534; text-decoration: none;">strasbourg@coworkingcafe.fr</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111827;">
                      Coworking Café by Anticafé
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">
                      1 rue de la Division Leclerc, 67000 Strasbourg
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">
                      L-V: 09h-20h | S-D & JF: 10h-20h
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// 4. Email de non-présentation - Empreinte encaissée
function getNoShowEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Absence Constatée
                    </h1>
                    <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 15px;">
                      Empreinte bancaire encaissée
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                      Bonjour ${data.name},
                    </h2>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Nous constatons que vous ne vous êtes pas présenté(e) pour votre réservation du <strong>${data.date}</strong>.
                    </p>

                    <!-- Warning Badge -->
                    <div style="background: #fee2e2; border: 2px solid #ef4444; padding: 24px; border-radius: 8px; margin-bottom: 32px; text-align: center;">
                      <div style="font-size: 36px; margin-bottom: 12px;">💳</div>
                      <p style="margin: 0 0 8px 0; color: #991b1b; font-size: 18px; font-weight: 700;">
                        Empreinte bancaire encaissée
                      </p>
                      <p style="margin: 0; color: #991b1b; font-size: 24px; font-weight: 700;">
                        ${data.depositAmount.toFixed(2)}€
                      </p>
                      <p style="margin: 12px 0 0 0; color: #991b1b; font-size: 13px;">
                        Conformément à nos conditions générales
                      </p>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      L'empreinte bancaire de <strong>${data.depositAmount.toFixed(2)}€</strong> qui avait été effectuée lors de votre réservation a été <strong style="color: #ef4444;">encaissée suite à votre absence</strong>.
                    </p>

                    <!-- Booking Details -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
                        📋 Détails de la réservation
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.8;">
                        <strong>Espace :</strong> ${data.spaceName}<br>
                        <strong>Date :</strong> ${data.date}<br>
                        <strong>Horaire :</strong> ${data.startTime} - ${data.endTime}<br>
                        <strong>Montant encaissé :</strong> <span style="color: #ef4444; font-weight: 600;">${data.depositAmount.toFixed(2)}€</span>
                      </p>
                    </div>

                    <!-- Invoice Info -->
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                        📄 Besoin d'une facture ?
                      </p>
                      <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
                        Si vous souhaitez recevoir une facture pour ce prélèvement, merci de faire votre demande par email à : <a href="mailto:strasbourg@coworkingcafe.fr" style="color: #1e40af; font-weight: 600; text-decoration: underline;">strasbourg@coworkingcafe.fr</a>
                      </p>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter dans les plus brefs délais.
                    </p>

                    <!-- Contact -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
                        💬 Contactez-nous
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">
                        📞 <a href="tel:0987334519" style="color: #6b7280; text-decoration: none;">09 87 33 45 19</a><br>
                        📧 <a href="mailto:strasbourg@coworkingcafe.fr" style="color: #6b7280; text-decoration: none;">strasbourg@coworkingcafe.fr</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111827;">
                      Coworking Café by Anticafé
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">
                      1 rue de la Division Leclerc, 67000 Strasbourg
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">
                      L-V: 09h-20h | S-D & JF: 10h-20h
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

// 5. Email d'annulation par le commerce
function getCancelledEmailHTML(data: any) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">

                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 30px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🔔</div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                      Annulation de Réservation
                    </h1>
                    <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.95); font-size: 15px;">
                      Empreinte bancaire libérée
                    </p>
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
                      Bonjour ${data.name},
                    </h2>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Nous sommes au regret de vous informer que nous devons annuler votre réservation prévue le <strong>${data.date}</strong>.
                    </p>

                    <!-- Cancelled Badge -->
                    <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 24px; border-radius: 8px; margin-bottom: 32px; text-align: center;">
                      <div style="font-size: 36px; margin-bottom: 12px;">❌</div>
                      <p style="margin: 0 0 8px 0; color: #92400e; font-size: 18px; font-weight: 700;">
                        Réservation annulée
                      </p>
                      <p style="margin: 0; color: #92400e; font-size: 16px; font-weight: 600;">
                        ${data.confirmationNumber}
                      </p>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Cette annulation est indépendante de notre volonté et nous nous en excusons sincèrement. 🙏
                    </p>

                    <!-- Refund Info -->
                    <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; color: #065f46; font-size: 14px; font-weight: 600;">
                        ✅ Empreinte bancaire libérée
                      </p>
                      <p style="margin: 0; color: #065f46; font-size: 13px; line-height: 1.5;">
                        L'empreinte bancaire de <strong>${data.depositAmount.toFixed(2)}€</strong> a été automatiquement annulée. Aucun montant ne sera débité de votre compte.
                      </p>
                    </div>

                    <!-- Booking Details -->
                    <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #111827;">
                        📋 Détails de la réservation annulée
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.8;">
                        <strong>Espace :</strong> ${data.spaceName}<br>
                        <strong>Date :</strong> ${data.date}<br>
                        <strong>Horaire :</strong> ${data.startTime} - ${data.endTime}<br>
                        <strong>N° de confirmation :</strong> ${data.confirmationNumber}
                      </p>
                    </div>

                    <!-- New Booking -->
                    <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 6px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; color: #1e40af; font-size: 14px; font-weight: 600;">
                        📅 Nouvelle réservation ?
                      </p>
                      <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.5;">
                        Nous serions ravis de vous accueillir à une autre date. N'hésitez pas à effectuer une nouvelle réservation ou à nous contacter pour trouver un créneau qui vous convient.
                      </p>
                    </div>

                    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #4b5563;">
                      Nous restons à votre disposition pour toute question et espérons avoir l'occasion de vous accueillir prochainement.
                    </p>

                    <!-- Contact -->
                    <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin-top: 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #166534;">
                        💬 Nous sommes là pour vous
                      </p>
                      <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.6;">
                        📞 <a href="tel:0987334519" style="color: #166534; text-decoration: none;">09 87 33 45 19</a><br>
                        📧 <a href="mailto:strasbourg@coworkingcafe.fr" style="color: #166534; text-decoration: none;">strasbourg@coworkingcafe.fr</a>
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #111827;">
                      Coworking Café by Anticafé
                    </p>
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280;">
                      1 rue de la Division Leclerc, 67000 Strasbourg
                    </p>
                    <p style="margin: 0; font-size: 13px; color: #6b7280;">
                      L-V: 09h-20h | S-D & JF: 10h-20h
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
