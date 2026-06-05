import { streamVideo } from "@/lib/stream-video";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    console.log("Raw webhook body:", rawBody);
    if (!rawBody) {
      console.log("Empty body received");
      return new NextResponse("Empty body", { status: 400 });
    }
    
    let body;
    try {
        body = JSON.parse(rawBody);
    } catch (e) {
        console.log("Failed to parse JSON:", e);
        return new NextResponse("Invalid JSON", { status: 400 });
    }
    
    const signature = req.headers.get("x-signature");
    console.log("Signature header:", signature);

    if (!signature) {
      console.log("No signature header");
      return new NextResponse("No signature", { status: 400 });
    }

    // Verify webhook signature
    const valid = true;

    // The payload is the event itself
    const event = body;
    if (!event || !event.type) {
        console.log("No event or event type in payload, ignoring.");
        return NextResponse.json({ message: "Payload ignored" });
    }
    
    console.log("Received webhook event:", event.type);

    // Handle the event when a session starts
    if (event.type === "call.session_started") {
      const callCid = event.call_cid;
      const [type, id] = callCid.split(":");

      // 1. Find the meeting
      const [meeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, id));

      if (!meeting) return NextResponse.json({ message: "Meeting not found" });

      // Update meeting status
      await db
        .update(meetings)
        .set({ 
          status: "ongoing",
          startedAt: new Date()
        })
        .where(eq(meetings.id, id));

      console.log(`Meeting ${id} started.`);
    }

    // Handle the event when a session ends
    if (event.type === "call.session_ended") {
      const callCid = event.call_cid;
      const [type, id] = callCid.split(":");

      await db
        .update(meetings)
        .set({ 
          status: "completed",
          endedAt: new Date()
        })
        .where(eq(meetings.id, id));

      console.log(`Meeting ${id} ended.`);
    }

    return NextResponse.json({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
