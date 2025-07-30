// src/app/(routes)/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

// تعريف نوع البيانات للممتلكات المسروقة
interface StolenItem {
  id: string;
  category: string;
  brand: string;
  model: string;
  createdAt: string;
  images: string[];
  status: 'active' | 'recovered' | 'closed';
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState<StolenItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // لا تقم بالجلب إلا بعد تحميل معلومات المستخدم
    if (!isLoaded) return;

    // إذا لم يكن المستخدم مسجلاً، لا تفعل شيئًا
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchUserItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/user/stolen-items');
        if (!response.ok) {
          throw new Error('Kunde inte hämta dina anmälningar.');
        }
        const data = await response.json();
        setItems(data);
     } catch (err) { // <-- تغيير هنا
  setError(err instanceof Error ? err.message : 'An unknown error occurred.'); // <-- طريقة آمنة للتعامل مع الخطأ
} finally {
      // *** هذا هو الإصلاح ***
      setIsLoading(false);
    }
    };

    fetchUserItems();
  }, [isLoaded, user]); // يتم تشغيل التأثير عند تغير حالة تحميل المستخدم

  if (isLoading || !isLoaded) {
    return <div className="text-center py-20">Laddar din instrumentpanel...</div>;
  }

  if (!user) {
    return <div className="text-center py-20">Du måste vara inloggad för att se denna sida.</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Mina anmälningar</h1>
        <p className="text-gray-600 mt-2">
          Här är en översikt över de föremål du har anmält som stulna.
        </p>
      </header>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/stoldgods/efterlysning/${item.id}`}
              className="flex items-center bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={item.images && item.images.length > 0 ? item.images[0] : '/placeholder.svg'}
                  alt={item.brand}
                  layout="fill"
                  objectFit={item.images && item.images.length > 0 ? 'cover' : 'contain'}
                  className={item.images && item.images.length > 0 ? '' : 'p-2 text-gray-400'}
                />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold text-lg">{item.brand} {item.model}</h3>
                <p className="text-sm text-gray-500">
                  Anmäld: {new Date(item.createdAt).toLocaleDateString('sv-SE')}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                item.status === 'active' ? 'bg-yellow-100 text-yellow-800' : 
                item.status === 'recovered' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold">Du har inga aktiva anmälningar</h2>
          <p className="text-gray-600 mt-2 mb-6">
            Har du blivit av med något? Skapa en anmälan för att öka chansen att hitta det.
          </p>
          <Link
            href="/stoldgods/anmal"
            className="inline-block bg-[#005ea2] text-white px-6 py-3 rounded-md hover:bg-[#004e8a] transition-colors"
          >
            Anmäl stulet föremål
          </Link>
        </div>
      )}
    </div>
  );
}