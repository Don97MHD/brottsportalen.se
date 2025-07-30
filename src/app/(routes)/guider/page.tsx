// src/app/(routes)/guider/page.tsx

import { getAllGuides } from '@/lib/guides';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guider - Hjälp och Förebyggande | Brottsportalen',
  description: 'Hitta praktiska guider, checklistor och råd för att förebygga brott och få hjälp om du blivit utsatt. Från att säkra ditt hem till vad du ska göra efter en stöld.',
};

export default function GuidesIndexPage() {
  const guides = getAllGuides();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Guider för hjälp och förebyggande</h1>
        <p className="mt-4 text-xl text-gray-600">
          Praktiska råd och steg-för-steg-instruktioner för ett tryggare liv.
        </p>
      </header>

      <div className="space-y-8">
        {guides.map((guide) => (
          <Link href={`/guider/${guide.slug}`} key={guide.id} className="block bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
              {guide.category}
            </span>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{guide.title}</h2>
            <p className="text-gray-600 mb-4">{guide.excerpt}</p>
            <div className="text-sm text-gray-500">
              <span>{new Date(guide.date).toLocaleDateString('sv-SE', { dateStyle: 'long' })}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}