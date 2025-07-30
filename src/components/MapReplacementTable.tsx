// src/components/MapReplacementTable.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';

// تعريف أنواع البيانات
interface Event {
  id: string;
  type: string;
  location: string;
  description: string;
  datetime: string;
}

interface MapReplacementProps {
  filters: {
    crimeType: string;
    timeRange: string;
  };
}

export default function MapReplacementTable({ filters }: MapReplacementProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // دالة لجلب البيانات بناءً على الفلاتر
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Kunde inte hämta händelsedata.');
      }
      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ett okänt fel inträffade.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // عرض رسالة التحميل
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-600">Laddar händelser...</p>
      </div>
    );
  }

  // عرض رسالة الخطأ
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Ett fel inträffade: {error}</p>
      </div>
    );
  }
  
  // عرض رسالة في حال عدم وجود نتائج
  if (events.length === 0) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500">Inga händelser hittades för de valda filtren.</p>
        </div>
    );
  }

  // عرض الجدول
  return (
    <div className="h-full w-full overflow-y-auto bg-white rounded-lg shadow border">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-800 uppercase bg-gray-50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">Brottstyp</th>
            <th scope="col" className="px-6 py-3">Plats</th>
            <th scope="col" className="px-6 py-3">Datum & Tid</th>
            <th scope="col" className="px-6 py-3">Beskrivning</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold">{event.type}</td>
              <td className="px-6 py-4">{event.location}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(event.datetime).toLocaleString('sv-SE', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
              <td className="px-6 py-4">{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}