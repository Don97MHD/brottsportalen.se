// src/app/(routes)/handelse/[eventId]/page.tsx (النسخة المحدّثة)

import type { Metadata } from 'next';

// تعريف نوع البيانات ليتطابق مع قاعدة البيانات
interface Event {
  id: string;
  type: string;
  location: string;
  datetime: string; // ISO string from DB
  description: string;
}

// دالة لجلب البيانات من الواجهة البرمجية الجديدة
async function getEventDetails(eventId: string): Promise<Event | null> {
  try {
    // يجب استخدام الرابط الكامل عند الجلب من الخادم
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
      cache: 'no-store', // لضمان جلب أحدث البيانات دائمًا
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return null;
  }
}

// دالة لتوليد الـ metadata ديناميكيًا
export async function generateMetadata({ params }: { params: { eventId: string } }): Promise<Metadata> {
    const event = await getEventDetails(params.eventId);
    if (!event) {
        return {
            title: 'Händelse hittades inte'
        }
    }
    return {
        title: `${event.type} i ${event.location} | Brottsportalen`,
        description: event.description,
    }
}

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
  const event = await getEventDetails(params.eventId);

  if (!event) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Händelsen kunde inte hittas</h1>
        <p className="text-gray-600 mt-4">Vi kunde inte hitta information för den angivna händelsen (ID: {params.eventId}).</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md border">
      <header className="border-b pb-4 mb-6">
        <p className="text-gray-500 text-base sm:text-lg">
          {new Date(event.datetime).toLocaleString('sv-SE', { dateStyle: 'full', timeStyle: 'short' })}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold mt-2">{event.type}</h1>
        <p className="text-lg sm:text-xl text-gray-700 mt-2">{event.location}</p>
      </header>
      
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Beskrivning av händelsen</h2>
        <p className="text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
          {event.description}
        </p>
      </section>
    </div>
  );
}

