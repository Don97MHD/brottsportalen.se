// src/app/(routes)/stoldgods/efterlysning/[itemId]/page.tsx (النسخة المحدّثة والكاملة)
'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

// تعريف نوع البيانات للممتلكات المسروقة
interface StolenItem {
  id: string;
  category: string;
  brand: string;
  model: string;
  serialNumber: string | null;
  location: string;
  stolenDate: string;
  createdAt: string;
  description: string;
  images: string[];
  status: 'active' | 'recovered' | 'closed';
  userId: string; // إضافة userId للتحقق من الملكية
}

export default function StolenItemDetailsPage() {
  const { itemId } = useParams();
  const { user, isLoaded: isUserLoaded } = useUser(); // الحصول على معلومات المستخدم المسجل
  const [item, setItem] = useState<StolenItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false); // حالة لتتبع عملية التحديث

  // التحقق مما إذا كان المستخدم الحالي هو مالك البلاغ
  const isOwner = user && item && user.id === item.userId;

  useEffect(() => {
    if (!itemId) return;

    const fetchItemDetails = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch(`/api/stoldgods/${itemId}`);
        if (!response.ok) {
          throw new Error('Kunde inte hämta information om föremålet.');
        }
        const data = await response.json();
        setItem(data);
} catch (err) { // <-- تغيير هنا
  setError(err instanceof Error ? err.message : 'Ett fel uppstod.');
} finally {
        setIsLoading(false); 
      }
    };

    fetchItemDetails();
  }, [itemId]);

  const handleStatusChange = async (newStatus: StolenItem['status']) => {
    if (!isOwner || !item) return;
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/stoldgods/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Kunde inte uppdatera status.');
      }

      const updatedItem = await response.json();
      setItem(updatedItem); // تحديث الحالة في الواجهة فورًا
      alert('Status har uppdaterats!');
} catch (err) { // <-- تغيير هنا
  setError(err instanceof Error ? err.message : 'Ett fel uppstod.');
} finally {
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktiv efterlysning';
      case 'recovered': return 'Återfunnen';
      case 'closed': return 'Ärendet avslutat';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'recovered': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading || !isUserLoaded) {
    return <div className="text-center py-20">Laddar föremål...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  if (!item) {
    return <div className="text-center py-20">Föremålet kunde inte hittas.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Link href="/stoldgods/sok" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
        ← Tillbaka till sökning
      </Link>

      {/* --- قسم الإدارة (يظهر فقط للمالك) --- */}
      {isOwner && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-blue-800">Hantera din anmälan</h2>
          <p className="text-blue-700 text-sm mt-1 mb-3">
            Eftersom du är ägare till denna anmälan kan du ändra dess status.
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="text-sm font-medium">Ändra status till:</label>
            <select
              value={item.status}
              onChange={(e) => handleStatusChange(e.target.value as StolenItem['status'])}
              disabled={isUpdating}
              className="bg-white border border-gray-300 rounded-md p-1.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Aktiv</option>
              <option value="recovered">Återfunnen</option>
              <option value="closed">Avslutad</option>
            </select>
            {isUpdating && <span className="text-sm text-gray-500">Uppdaterar...</span>}
          </div>
        </div>
      )}
      {/* --- نهاية قسم الإدارة --- */}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <p className="text-gray-600">{item.category}</p>
              <h1 className="text-3xl font-bold">{item.brand} {item.model}</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(item.status)}`}>
              {getStatusLabel(item.status)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* قسم الصور */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-2">Bilder</h2>
            {item.images && item.images.length > 0 ? (
              <div className="space-y-4">
                {item.images.map((image, index) => (
                  <div key={index} className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <Image 
                      src={image} 
                      alt={`${item.brand} ${item.model} bild ${index + 1}`} 
                      layout="fill" 
                      objectFit="cover" 
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg"
                  alt="Ingen bild tillgänglig"
                  layout="fill"
                  objectFit="contain"
                  className="p-12 text-gray-400"
                />
              </div>
            )}
          </div>

          {/* قسم المعلومات */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Information</h2>
            <dl className="space-y-4">
              {item.serialNumber && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Serienummer</dt>
                  <dd className="font-semibold text-gray-800">{item.serialNumber}</dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Plats för stöld</dt>
                <dd className="font-semibold text-gray-800">{item.location}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Stulen den</dt>
                <dd className="font-semibold text-gray-800">{new Date(item.stolenDate).toLocaleDateString('sv-SE')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Anmäld den</dt>
                <dd className="font-semibold text-gray-800">{new Date(item.createdAt).toLocaleDateString('sv-SE')}</dd>
              </div>
            </dl>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-2">Beskrivning</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>
          </div>
        </div>

        {/* قسم التواصل */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 mt-6">
          <h2 className="text-lg font-semibold mb-3">Har du information?</h2>
          <p className="text-gray-700 mb-4">
            Om du har sett denna egendom eller har information som kan hjälpa till, kontakta polisen på 114 14 eller via deras hemsida.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="tel:11414" className="bg-[#005ea2] text-white px-6 py-2 rounded-md hover:bg-[#004e8a] transition-colors">
              Ring Polisen (114 14)
            </a>
            <a href="https://polisen.se" target="_blank" rel="noopener noreferrer" className="bg-white text-[#005ea2] border border-[#005ea2] px-6 py-2 rounded-md hover:bg-gray-50 transition-colors">
              Besök polisen.se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}