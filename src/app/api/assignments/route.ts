// src/app/api/assignments/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Assignment from '@/models/Assignment';
import Order from '@/models/Order';
import Partner from '@/models/Partner';
// import { assignmentSchema } from '@/lib/validations/assignment';
// import { z } from 'zod';
// import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { IAssignment } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const partnerId = searchParams.get('partnerId');

    await connectDB();

    interface IQueryParams {
      status?: string;
      partnerId?: string;
    }
    
    const query: IQueryParams = {};
    if (status) query.status = status;
    if (partnerId) query.partnerId = partnerId;

    const assignments = await Assignment.find(query)
      .populate('orderId', 'orderNumber status')
      .populate('partnerId', 'name email')
      .sort({ timestamp: -1 });
    return NextResponse.json(assignments);
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch assignments, error = ', err },
      { status: 500 }
    );
  }
}

// POST /api/assignments/run - Automatic assignment system
export async function POST() {
  //await connectDB();
  //Claude OLD
  // const session = await connectDB().startSession();
  // console.log("started")

  //GPT new random
  const con = (await mongoose.connect(process.env.MONGODB_URI!)).connection;
  const session = await con.startSession(); // Start the session using the connection
  const assignments: IAssignment[] = [];
  console.log("Started session");


  console.log("SESSION STARTED")
  try {
    await session.withTransaction(async () => {
      // 1. Get all pending orders
      const pendingOrders = await Order.find({
        status: 'pending',
        // assignedTo: { $exists: false }
      });

      // 2. Get all active partners with current load < 3
      const availablePartners = await Partner.find({
        status: 'active',
        // currentLoad: { $lt: 3 }
      });

      console.log("pendingOrders = ", pendingOrders.map(o => o.orderNumber))
      console.log("availablePartners = ", availablePartners.map(p => p.name + " " + p.currentLoad))

      // 3. For each pending order
      for (const order of pendingOrders) {
        //MY checks
        // console.log("partner.areas = ", availablePartners.map(p => p.areas))
        // console.log("orderArea = ", order.area)

        // const shiftArr = availablePartners.map(p => {
        //   const ans = isTimeWithinShift(order.scheduledFor, p.shift) ? "Yes" : "No";
        // console.log(p.areas.map(pArea => pArea.toLowerCase() === order.area.toLowerCase()));
        //   return ans;
        // })
        // console.log("shiftArr = ", shiftArr)
        // console.log(partner.areas.map(pArea => pArea.toLowerCase() === order.area.toLowerCase()))

        // Find best matching partner based on area and load
        const matchingPartner = availablePartners.find(partner =>
          partner?.areas?.map((pArea: string) => pArea.toLowerCase()).includes(order?.area?.toLowerCase()) &&
          partner.currentLoad < 3 &&
          // Check if partner's shift covers the order's scheduled time
          isTimeWithinShift(order.scheduledFor, partner.shift)
        );

        // console.log("order = ", order || "no order")
        console.log("matchingPartner = ", matchingPartner?.name || "no matching partner")

        if (matchingPartner) {
          // Create assignment
          const assignment = await Assignment.create({
            orderId: order._id,
            partnerId: matchingPartner._id,
            timestamp: new Date(),
            status: 'success',
            reason: 'Partner found for the Time and Area'
          });

          // Update order
          await Order.findByIdAndUpdate(order._id, {
            status: 'assigned',
            assignedTo: matchingPartner._id,
          });

          // Update partner's current load
          matchingPartner.currentLoad += 1;
          await matchingPartner.save();

          assignments.push(assignment);
        } else {
          // Create failed assignment record
          const assignment = await Assignment.create({
            orderId: order._id,
            timestamp: new Date(),
            status: 'failed',
            reason: 'No matching partner available'
          });
          assignments.push(assignment);
        }
      }
    });
      console.log("assignments = ", assignments)
      return NextResponse.json({
        message: 'Assignment process completed',
        assignments
      });

  } catch (error) {
    console.log("error", error)
    return NextResponse.json(
      { error: 'Failed to run assignment process' },
      { status: 500 }
    );
  } finally {
    console.log("ENDING")
    await session.endSession();
  }
}
// Helper function to check if time is within shift
function isTimeWithinShift(scheduledTime: string, shift: { start: string; end: string }) {
  const scheduled = new Date(`1970/01/01 ${scheduledTime}`);
  const shiftStart = new Date(`1970/01/01 ${shift.start}`);
  const shiftEnd = new Date(`1970/01/01 ${shift.end}`);
  // console.log("Shift matches? = ", scheduled >= shiftStart && scheduled <= shiftEnd)
  return scheduled >= shiftStart && scheduled <= shiftEnd;
}