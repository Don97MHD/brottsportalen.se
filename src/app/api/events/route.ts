// src/app/api/events/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays } from 'date-fns'; // مكتبة مفيدة للتعامل مع التواريخ
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const crimeType = searchParams.get('crimeType');
    const timeRange = searchParams.get('timeRange');
    const limit = searchParams.get('limit');

const filters: { type?: string; datetime?: { gte: Date } } = {};
    // فلتر حسب نوع الجريمة
    if (crimeType && crimeType !== 'all') {
      filters.type = crimeType;
    }

    // فلتر حسب الفترة الزمنية
   if (timeRange) {
  // --- التغيير هنا: حدد النوع الصحيح لـ dateFilter ---
  let dateFilter: { gte: Date } | undefined = undefined;
  switch (timeRange) {
    case '24h':
      dateFilter = { gte: subDays(new Date(), 1) };
      break;
    case '7d':
      dateFilter = { gte: subDays(new Date(), 7) };
      break;
    case '30d':
      dateFilter = { gte: subDays(new Date(), 30) };
      break;
  }
  // --- وأضف هذا التحقق قبل الإسناد ---
  if (dateFilter) {
    filters.datetime = dateFilter;
  }
}
    
   const queryOptions: { where: typeof filters; orderBy: { datetime: 'desc' }; take?: number } = { // <-- تحديد نوع دقيق
  where: filters,
  orderBy: { datetime: 'desc' },
};

    if (limit) {
      queryOptions.take = parseInt(limit, 10);
    }


    const events = await prisma.event.findMany(queryOptions);

    return NextResponse.json(events);

  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error while fetching events' },
      { status: 500 }
    );
  }
}