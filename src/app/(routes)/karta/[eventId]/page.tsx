// src/app/(routes)/händelser/[eventId]/page.tsx (النسخة المحدّثة مع Schema.org)

import type { Metadata } from 'next';
import { notFound } from 'next/navigation'; // <-- تأكد من وجود هذا السطر

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events/${eventId}`, {
      cache: 'no-store',
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

// --- START: التغيير هنا ---
// دالة لتوليد الـ metadata ديناميكيًا مع مخطط Schema.org
export async function generateMetadata({ params }: { params: { eventId: string } }): Promise<Metadata> {
    const event = await getEventDetails(params.eventId);
    if (!event) {
        return {
            title: 'Händelse hittades inte'
        }
    }

    // إنشاء كائن JSON-LD لمخطط الحدث
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${event.type} i ${event.location}`,
      description: event.description,
      startDate: new Date(event.datetime).toISOString(),
      location: {
        '@type': 'Place',
        name: event.location,
        address: event.location
      },
    };

    return {
        title: `${event.type} i ${event.location} | Brottsportalen`,
        description: event.description,
        // حقن السكيما في رأس الصفحة
         other: {
            'script[type="application/ld+json"]': JSON.stringify(jsonLd),
        },
    }
}
// --- END: التغيير هنا ---

export default async function EventDetailPage({ params }: { params: { eventId: string } }) {
  const event = await getEventDetails(params.eventId);

  if (!event) {
    //  ---  تصحيح هنا: استخدام notFound() هو الأفضل  --- 
    notFound();
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