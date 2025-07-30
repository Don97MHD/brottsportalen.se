// src/app/api/statistics/national/route.ts (النسخة المصححة من خطأ النوع)
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { subDays, startOfMonth, endOfMonth, format } from 'date-fns';
import { sv } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

// --- التصحيح هنا: تعريف نوع للبيانات المجمعة ---
type GroupedEvent = {
    type: string;
    _count: {
        type: number;
    };
};

export async function GET() {
  console.log('[API /api/statistics/national] - Received a GET request.');

  try {
    const now = new Date();

    // --- 1. حساب الإحصائيات الرئيسية (Key Stats) ---
    const thirtyDaysAgo = subDays(now, 30);
    const sixtyDaysAgo = subDays(now, 60);

    const currentPeriodTotal = await prisma.event.count({
      where: { datetime: { gte: thirtyDaysAgo } },
    });

    const previousPeriodTotal = await prisma.event.count({
      where: {
        datetime: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
    });

    let trend = 0;
    if (previousPeriodTotal > 0) {
      trend = ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100;
    } else if (currentPeriodTotal > 0) {
      trend = 100;
    }

    // --- 2. توزيع الجرائم (Crime Distribution) ---
    const crimeDistributionData = await prisma.event.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
      where: { datetime: { gte: thirtyDaysAgo } },
      orderBy: {
        _count: {
          type: 'desc',
        },
      },
    });

    // --- التصحيح هنا: استخدام النوع الذي عرفناه ---
    const crimeDistribution = crimeDistributionData.map((item: GroupedEvent) => ({
      type: item.type,
      count: item._count.type,
    }));

    const mostCommonCrime = crimeDistribution.length > 0 ? crimeDistribution[0].type : 'Ingen data';

    // --- 3. الاتجاه الشهري (Monthly Trend) ---
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = subDays(now, i * 30);
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);

      const count = await prisma.event.count({
        where: {
          datetime: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      });

      monthlyTrend.push({
        month: format(monthStart, 'MMM', { locale: sv }),
        count: count,
      });
    }

    const responseData = {
      keyStats: {
        total: currentPeriodTotal,
        mostCommon: mostCommonCrime,
        trend: parseFloat(trend.toFixed(1)),
      },
      crimeDistribution,
      monthlyTrend,
    };
    
    console.log('[API /api/statistics/national] - Successfully fetched data.');
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('--- !!! DATABASE ERROR IN /api/statistics/national !!! ---');
    console.error(error);
    console.error('---------------------------------------------------------');

    return NextResponse.json(
      { error: 'Internal server error while fetching national statistics.', details: error },
      { status: 500 }
    );
  }
}