import { options as authOptions } from "@/lib/auth-options";
import { connectDB } from "@/lib/mongodb";
import { ContactMail } from "@/models/contactMail";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// GET - Get single message
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const message = await ContactMail.findById(id).lean();

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Erreur récupération message:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du message" },
      { status: 500 }
    );
  }
}

// PUT - Update message (status, reply)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const { id } = await params;

    const body = await request.json();
    const { status, reply } = body;

    const updateData: Record<string, unknown> = {};

    if (status) {
      updateData.status = status;
    }

    if (reply) {
      updateData.reply = reply;
      updateData.repliedAt = new Date();
      updateData.status = "replied";
      if (session?.user?.id) {
        updateData.repliedBy = session.user.id;
      }

      // Get original message to send reply
      const originalMessage = await ContactMail.findById(id);
      if (originalMessage) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: originalMessage.email,
            subject: `Re: ${originalMessage.subject}`,
            html: `
              <h2>Réponse à votre message</h2>
              <p>Bonjour ${originalMessage.name},</p>
              <p>${reply.replace(/\n/g, "<br />")}</p>
              <hr />
              <p><small>Votre message original:</small></p>
              <blockquote style="border-left: 3px solid #ccc; padding-left: 10px; color: #666;">
                ${originalMessage.message.replace(/\n/g, "<br />")}
              </blockquote>
              <hr />
              <p>L'équipe Cow-or-King Café</p>
            `,
          });
        } catch (emailError) {
          console.error("Erreur envoi réponse email:", emailError);
        }
      }
    }

    const message = await ContactMail.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).lean();

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Erreur mise à jour message:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du message" },
      { status: 500 }
    );
  }
}

// DELETE - Delete message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const message = await ContactMail.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json(
        { error: "Message non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression message:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du message" },
      { status: 500 }
    );
  }
}
