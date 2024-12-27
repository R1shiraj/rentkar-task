/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/partners/[id]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Partner from '@/models/Partner';
import { partnerSchema } from '@/lib/validations/partner';
import { z } from 'zod';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = (await params)
    const partner = await Partner.findById(id);
    
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(partner);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
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
    const validatedData = partnerSchema.parse(body);
    const { id } = (await params)
    
    await connectDB();
    const partner = await Partner.findByIdAndUpdate(
      id,
      validatedData,
      { new: true }
    );
    
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(partner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = (await params)

    const partner = await Partner.findByIdAndDelete(id);
    
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete partner' },
      { status: 500 }
    );
  }
} 