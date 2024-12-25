/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/partners/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Partner from '@/models/Partner';
import { partnerSchema } from '@/lib/validations/partner';
import { z } from 'zod';

export async function GET() {
  try {
    await connectDB();
    const partners = await Partner.find({});
    return NextResponse.json(partners);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = partnerSchema.parse(body);
    
    await connectDB();
    const partner = await Partner.create(validatedData);
    
    return NextResponse.json(partner, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}