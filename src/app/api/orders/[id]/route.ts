// src/app/api/orders/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Order from '@/models/Order';
import Partner from '@/models/Partner';
import { orderSchema } from '@/lib/validations/order';
import { z } from 'zod';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = (await params)
    const order = await Order.findById(id)
      .populate('assignedTo', 'name email');

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    return NextResponse.json(
      { error: 'Failed to fetch order, error = ', err },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    await connectDB();
    const { id } = (await params)
    
    let order;
    if (validatedData.assignedTo) {
      
      order = await Order.findByIdAndUpdate(
        id,
        validatedData,
        { new: true }
      ).populate('assignedTo', 'name email');
    } else {
      
      // Remove 'assignedTo' field
      delete validatedData.assignedTo;
      order = await Order.findByIdAndUpdate(
        id,
        validatedData,
        { new: true }
      )
      
    }
    // const order = await Order.findByIdAndUpdate(
    //   id,
    //   validatedData,
    //   { new: true }
    // ).populate('assignedTo', 'name email');
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = (await params)
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to delete order, err = ', err },
      { status: 500 }
    );
  }
}