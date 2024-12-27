// src/app/api/orders/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Order from '@/models/Order';
import Partner from '@/models/Partner';
import { orderSchema } from '@/lib/validations/order';
import { z } from 'zod';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const area = searchParams.get('area');

    await connectDB();
    
    const query: any = {};
    if (status) query.status = status;
    if (area) query.area = area;

    const orders = await Order.find(query)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = orderSchema.parse(body);
    
    // If assignedTo is provided, verify partner exists
    if (validatedData.assignedTo) {
      await connectDB();
      const partner = await Partner.findById(validatedData.assignedTo);
      if (!partner) {
        return NextResponse.json(
          { error: 'Assigned partner not found' },
          { status: 400 }
        );
      }
    }
    
    // Create order
    await connectDB();
    delete validatedData.assignedTo;
    console.log("validatedData = ", validatedData)
    const order = await Order.create(validatedData);
    console.log("order = ", order)
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}