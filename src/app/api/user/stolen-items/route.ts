// src/app/api/user/stolen-items/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    // 1. التحقق من أن المستخدم مسجل دخوله
    // --- KORRIGERING HÄR ---
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. جلب كل البلاغات التي تطابق معرف المستخدم الحالي
    const userItems = await prisma.stolenItem.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc', // عرض الأحدث أولاً
      },
    });

    // 3. إرجاع البيانات كـ JSON
    return NextResponse.json(userItems);

  } catch (error) {
    console.error('Error fetching user stolen items:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}