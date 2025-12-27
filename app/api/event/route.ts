import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { NextResponse } from "next/server";

// Dynamic API Config to handle large Base64 image payloads
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    await connectDB();
    const { step, data, vendorId } = await req.json();

    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
    }

    // --- STEP 1: CREATE NEW RECORD ON CHECK-IN ---
    if (step === 'check-in') {
      const newEvent = await Event.create({
        vendorId,
        status: 'checked_in',
        checkIn: {
          photo: data.photo,
          location: data.location,
          timestamp: data.timestamp || new Date(),
        },
        createdAt: new Date(),
      });
      return NextResponse.json(newEvent);
    }

    // --- STEPS 2-4: UPDATE THE CURRENT ACTIVE RECORD ---
    let updateFields = {};

    switch (step) {
      case 'start':
        updateFields = { status: 'started' };
        break;
      
      case 'progress':
        // data contains: { prePhoto, postPhoto, notes }
        updateFields = { 
          setup: data,
          status: 'in_progress' 
        };
        break;

      case 'complete':
        updateFields = { 
          status: 'completed',
          completedAt: new Date() 
        };
        break;

      default:
        return NextResponse.json({ error: "Invalid step provided" }, { status: 400 });
    }

    // Find the most recent record for this vendor and update it
    const updatedEvent = await Event.findOneAndUpdate(
      { vendorId },
      { $set: updateFields },
      { sort: { createdAt: -1 }, new: true } // sort ensures we update the latest session
    );

    return NextResponse.json(updatedEvent);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Parse URL parameters
    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');

    // CASE 1: Fetch only the LATEST record for a specific vendor (Summary Page)
    if (vendorId) {
      const latestEvent = await Event.findOne({ vendorId }).sort({ createdAt: -1 });
      if (!latestEvent) {
        return NextResponse.json({ error: "No records found for this vendor" }, { status: 404 });
      }
      return NextResponse.json(latestEvent);
    }

    // CASE 2: Fetch ALL records for the admin/history dashboard
    const allEvents = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json(allEvents);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}   