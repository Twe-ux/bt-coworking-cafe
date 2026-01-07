"use client";

import { generateBookingInitialEmail } from "@/lib/email/templates/bookingInitial";
import { useState } from "react";

export default function EmailPreviewPage() {
  const [previewData, setPreviewData] = useState({
    name: "Jean Dupont",
    spaceName: "Salle de l'Étage",
    date: "Lundi 15 janvier 2026",
    time: "14:00 - 18:00",
    price: 120,
    bookingId: "BK-2026-001",
    requiresPayment: true,
    depositAmount: 6000, // 60€ in cents
    captureMethod: "manual" as "manual" | "automatic",
    additionalServices: ["Vidéoprojecteur", "Tableau blanc"],
    numberOfPeople: 8,
  });

  const htmlContent = generateBookingInitialEmail(previewData);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "20px", background: "#f3f4f6", padding: "20px", borderRadius: "8px" }}>
        <h1 style={{ marginTop: 0 }}>Prévisualisation Email - Réservation Initiale</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "20px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nom</label>
            <input
              type="text"
              value={previewData.name}
              onChange={(e) => setPreviewData({ ...previewData, name: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Espace</label>
            <input
              type="text"
              value={previewData.spaceName}
              onChange={(e) => setPreviewData({ ...previewData, spaceName: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Date</label>
            <input
              type="text"
              value={previewData.date}
              onChange={(e) => setPreviewData({ ...previewData, date: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Horaire</label>
            <input
              type="text"
              value={previewData.time}
              onChange={(e) => setPreviewData({ ...previewData, time: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Prix (€)</label>
            <input
              type="number"
              value={previewData.price}
              onChange={(e) => setPreviewData({ ...previewData, price: parseFloat(e.target.value) })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Nombre de personnes</label>
            <input
              type="number"
              value={previewData.numberOfPeople || 0}
              onChange={(e) => setPreviewData({ ...previewData, numberOfPeople: parseInt(e.target.value) || undefined })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Empreinte (centimes)</label>
            <input
              type="number"
              value={previewData.depositAmount || 0}
              onChange={(e) => setPreviewData({ ...previewData, depositAmount: parseInt(e.target.value) })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Méthode de capture</label>
            <select
              value={previewData.captureMethod}
              onChange={(e) => setPreviewData({ ...previewData, captureMethod: e.target.value as "manual" | "automatic" })}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="manual">Manuel</option>
              <option value="automatic">Automatique</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Paiement requis</label>
            <input
              type="checkbox"
              checked={previewData.requiresPayment}
              onChange={(e) => setPreviewData({ ...previewData, requiresPayment: e.target.checked })}
              style={{ width: "20px", height: "20px" }}
            />
          </div>
        </div>
      </div>

      <div style={{ border: "2px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" }}>
        <iframe
          srcDoc={htmlContent}
          style={{ width: "100%", height: "800px", border: "none" }}
          title="Email Preview"
        />
      </div>
    </div>
  );
}
