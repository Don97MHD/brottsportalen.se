// src/app/api/stoldgods/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  try {
    // --- KORRIGERING HÄR ---
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      category,
      brand,
      model,
      serialNumber,
      location,
      stolenDate,
      description,
      images
    } = body;

    if (!category || !brand || !location || !stolenDate || !description) {
      return NextResponse.json(
        { error: 'Alla obligatoriska fält måste fyllas i' },
        { status: 400 }
      );
    }

    const newStolenItem = await prisma.stolenItem.create({
      data: {
        userId,
        category,
        brand,
        model: model || "",
        serialNumber,
        description,
        location,
        stolenDate: new Date(stolenDate),
        images: images || [],
        status: 'active',
      },
    });

    return NextResponse.json(newStolenItem, { status: 201 });

  } catch (error) {
    console.error('Error creating stolen item report:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const query = searchParams.get('query');
    const location = searchParams.get('location');

    const filters: { status: string; category?: string; location?: object; OR?: object[] } = {
      status: 'active',
    };

    if (category) {
      filters.category = category;
    }

    if (location) {
      filters.location = {
        contains: location,
        mode: 'insensitive',
      };
    }

    if (query) {
      filters.OR = [
        { brand: { contains: query, mode: 'insensitive' } },
        { model: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.stolenItem.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json(items);

  } catch (error) {
    console.error('Error fetching stolen items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}