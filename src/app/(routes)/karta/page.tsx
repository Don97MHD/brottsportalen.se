// src/app/(routes)/karta/page.tsx (النسخة النهائية مع الجدول بدلاً من الخريطة)
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// استيراد مكون الفلاتر
import FilterPanel from '@/components/FilterPanel';

// ---  هنا التغيير: نستورد مكون الجدول الجديد ---
// نستخدم dynamic هنا كإجراء احترازي، رغم أن الجدول لا يسبب مشاكل
const MapReplacementTable = dynamic(() => import('@/components/MapReplacementTable'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100"><p>Laddar...</p></div>,
});


// تعريف نوع حالة الفلاتر
interface FilterState {
  crimeType: string;
  timeRange: string;
}

export default function MapPage() {
  const [filters, setFilters] = useState<FilterState>({
    crimeType: 'all',
    timeRange: '24h',
  });

  return (
    // استخدام Flexbox للحفاظ على التصميم الجانبي
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh_-_150px)]">
      
      {/* العمود الأول: الفلاتر */}
      <div className="w-full md:w-80 flex-shrink-0">
        <FilterPanel 
            filters={filters} 
            // @ts-ignore
            onFiltersChange={setFilters} 
        />
      </div>
      
      {/* العمود الثاني: الجدول (يأخذ المساحة المتبقية) */}
      <div className="flex-grow h-full">
        <MapReplacementTable filters={filters} />
      </div>

    </div>
  );
}

