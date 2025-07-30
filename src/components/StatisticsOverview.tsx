// src/components/StatisticsOverview.tsx (النسخة المحسّنة)
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// تعريف أنواع البيانات المتوقعة من الـ API
interface KeyStats {
  total: number;
  mostCommon: string;
  trend: number;
}
interface CrimeDistribution {
  type: string;
  count: number;
}

const StatisticsOverview = () => {
  const [stats, setStats] = useState<KeyStats | null>(null);
  const [distribution, setDistribution] = useState<CrimeDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null); // إعادة تعيين الخطأ قبل كل محاولة
    try {
      const response = await fetch('/api/statistics/national');
      if (!response.ok) {
        // التحقق من استجابة الخادم
        throw new Error(`Kunde inte hämta statistik: ${response.statusText}`);
      }
      const data = await response.json();
      setStats(data.keyStats);
      setDistribution(data.crimeDistribution);
} catch (err) { // <-- تغيير هنا
  setError(err instanceof Error ? err.message : 'An unknown error occurred.');
}finally {
  // هذا الكود سيُنفذ دائماً، سواء نجح الـ try أو فشل
  setIsLoading(false);
}
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // --- تحسينات على واجهة المستخدم هنا ---

  if (isLoading) {
    return (
      <div className="text-center p-10 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Laddar statistik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-xl font-semibold text-red-700">Ett fel uppstod</h3>
        <p className="text-red-600 mt-2 mb-4">
          {error}
        </p>
        <button
          onClick={fetchStats} // زر لإعادة المحاولة
          className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Försök igen
        </button>
      </div>
    );
  }

  if (!stats) {
    // حالة نادرة حيث لا يوجد خطأ ولكن لا توجد بيانات
    return <div className="text-center p-10">Ingen statistik att visa.</div>;
  }

  return (
    <div className="space-y-8">
      {/* ... (باقي الكود لعرض الإحصائيات يبقى كما هو) ... */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">Totalt antal brott</h3>
          <p className="text-4xl font-bold text-[#005ea2]">
            {stats.total.toLocaleString('sv-SE')}
          </p>
          <p className="text-sm text-gray-500 mt-2">Senaste 30 dagarna</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">Vanligaste brottet</h3>
          <p className="text-4xl font-bold text-[#005ea2] truncate">{stats.mostCommon}</p>
          <p className="text-sm text-gray-500 mt-2">Senaste 30 dagarna</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-2">Trend</h3>
          <p className={`text-4xl font-bold ${stats.trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {stats.trend > 0 ? '+' : ''}{stats.trend}%
          </p>
          <p className="text-sm text-gray-500 mt-2">Jämfört med föregående månad</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-6">Brottsfördelning (Senaste 30 dagarna)</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={distribution} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#005ea2" name="Antal" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;