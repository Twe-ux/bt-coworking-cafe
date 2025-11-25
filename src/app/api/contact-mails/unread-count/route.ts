import { connectDB } from "@/lib/mongodb";
import { ContactMail } from "@/models/contactMail";
import { NextResponse } from "next/server";

// GET - Count unread messages
export async function GET() {
  try {
    console.log("🔢 [Unread Count] Fetching unread messages count...");
    await connectDB();

    // Debug: Log collection name and database
    const collectionName = ContactMail.collection.name;
    const dbName = ContactMail.db.name;
    console.log("🔢 [Unread Count] Using collection:", collectionName, "in database:", dbName);

    // Debug: Count all messages
    const totalCount = await ContactMail.countDocuments({});
    console.log("🔢 [Unread Count] Total messages in DB:", totalCount);

    // Debug: Get all statuses
    const allMessages = await ContactMail.find({})
      .select("status _id")
      .limit(20)
      .lean();
    console.log("🔢 [Unread Count] Sample messages statuses:", allMessages);

    // Count unread
    const unreadCount = await ContactMail.countDocuments({
      status: "unread",
    });

    console.log("🔢 [Unread Count] Found", unreadCount, "unread messages out of", totalCount);

    // Also count by each status
    const statusCounts = await ContactMail.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log("🔢 [Unread Count] Status breakdown:", statusCounts);

    return NextResponse.json({
      count: unreadCount,
      // Uncomment below for debugging
      // debug: {
      //   total: totalCount,
      //   byStatus: statusCounts,
      //   samples: allMessages
      // }
    });
  } catch (error) {
    console.error("❌ [Unread Count] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors du comptage des messages", details: String(error) },
      { status: 500 }
    );
  }
}
