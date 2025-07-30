// src/app/api/stoldgods/[itemId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const { itemId } = params;

    const item = await prisma.stolenItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Föremålet hittades inte' }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching stolen item:', error);
    return NextResponse.json({ error: 'Internt serverfel' }, { status: 500 });
  }
}
export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    // --- KORRIGERING HÄR ---
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;
    const body = await req.json();
    const { status } = body; // vi bryr oss bara om status för nu

    // Validera att status är ett av de tillåtna värdena
    if (!['active', 'recovered', 'closed'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const item = await prisma.stolenItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Kontrollera att användaren äger objektet
    if (item.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedItem = await prisma.stolenItem.update({
      where: { id: itemId },
      data: {
        status: status, // Uppdatera endast status
      },
    });

    return NextResponse.json(updatedItem);

  } catch (error) {
    console.error('Error updating stolen item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    // --- KORRIGERING HÄR ---
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { itemId } = params;

    const item = await prisma.stolenItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    if (item.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.stolenItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Error deleting stolen item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}