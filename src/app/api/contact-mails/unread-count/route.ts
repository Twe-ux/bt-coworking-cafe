import { connectDB } from "@/lib/mongodb";
import { ContactMail } from "@/models/contactMail";
import { NextResponse } from "next/server";

// GET - Count unread messages
export async function GET() {
  try {
    await connectDB();

    const unreadCount = await ContactMail.countDocuments({
      status: "unread",
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Erreur comptage messages non lus:", error);
    return NextResponse.json(
      { error: "Erreur lors du comptage des messages" },
      { status: 500 }
    );
  }
}
