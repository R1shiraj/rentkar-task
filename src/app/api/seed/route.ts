// src/app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    
    if (result.success) {
      return NextResponse.json({ message: 'Database seeded successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to seed database' },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to seed database, err = ', err },
      { status: 500 }
    );
  }
}