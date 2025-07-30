// src/app/(routes)/guider/[guideSlug]/page.tsx (Slutgiltig version med rik UX)

import { getGuideBySlug, getAllGuides, calculateReadingTime, extractHeadings, getRelatedGuides, Heading } from '@/lib/guides';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// Funktion för innehållsförteckning (återanvänds)
const TableOfContents = ({ headings }: { headings: Heading[] }) => (
  <div className="bg-gray-50 p-6 rounded-lg border mb-8">
    <h2 className="text-xl font-bold mb-4">I denna guide</h2>
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li key={heading.slug} className={heading.level === 3 ? 'ml-4' : ''}>
          <a href={`#${heading.slug}`} className="text-blue-600 hover:underline">{heading.text}</a>
        </li>
      ))}
    </ul>
  </div>
);

// Funktion för relaterade guider (återanvänds)
const RelatedGuides = ({ guides }: { guides: Awaited<ReturnType<typeof getRelatedGuides>> }) => (
  <div className="mt-16 pt-8 border-t">
    <h2 className="text-3xl font-bold mb-6">Fler guider</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {guides.map((guide) => (
        <Link key={guide.id} href={`/guider/${guide.slug}`} className="block p-4 bg-white border rounded-lg hover:shadow-lg transition-shadow">
          <span className="text-sm font-semibold text-blue-700">{guide.category}</span>
          <h3 className="text-lg font-bold mt-2">{guide.title}</h3>
        </Link>
      ))}
    </div>
  </div>
);

// Sidan
export default async function GuidePage({ params }: { params: { guideSlug: string } }) {
  const guide = getGuideBySlug(params.guideSlug);

  if (!guide) {
    notFound();
  }

  const readingTime = calculateReadingTime(guide.content);
  const headings = extractHeadings(guide.content);
  const relatedGuides = getRelatedGuides(guide.category, guide.slug);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Brödsmulor */}
      <nav className="text-sm mb-4 text-gray-500">
        <Link href="/" className="hover:underline">Hem</Link>
        <span className="mx-2"> </span>
        <Link href="/guider" className="hover:underline">Guider</Link>
      </nav>

      <div className="bg-white p-8 rounded-lg shadow-lg border">
        <header className="mb-8 border-b pb-4">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4">
              {guide.category}
          </span>
          <h1 className="text-4xl font-bold">{guide.title}</h1>
          <div className="text-md text-gray-500 mt-4 flex items-center gap-4">
            <span>{new Date(guide.date).toLocaleDateString('sv-SE', { dateStyle: 'long' })}</span>
            <span className="mx-2">•</span>
            <span>Av: {guide.author}</span>
            <span className="mx-2">•</span>
            <span>Lästid: ca {readingTime} min</span>
          </div>
        </header>
        
        {headings.length > 0 && <TableOfContents headings={headings} />}

        <div
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
      </div>

      {relatedGuides.length > 0 && <RelatedGuides guides={relatedGuides} />}
    </div>
  );
}

// generateMetadata och generateStaticParams förblir desamma