import { connectDB } from "@/lib/mongodb";
import { ContactMail } from "@/models/contactMail";
import { NextResponse } from "next/server";

// GET - Count unread messages
export async function GET() {
  try {
    console.log("🔢 [Unread Count] Fetching unread messages count...");
    await connectDB();

    const unreadCount = await ContactMail.countDocuments({
      status: "unread",
    });

    console.log("🔢 [Unread Count] Found", unreadCount, "unread messages");
    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("❌ [Unread Count] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors du comptage des messages", details: String(error) },
      { status: 500 }
    );
  }
}
