// src/app/(routes)/artikel/[articleSlug]/page.tsx (Slutgiltig version med rik UX)

import { getPostBySlug, getAllPosts, calculateReadingTime, extractHeadings, getRelatedPosts, Heading } from '@/lib/blog';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// Funktion för att rendera innehållsförteckning
const TableOfContents = ({ headings }: { headings: Heading[] }) => (
  <div className="bg-gray-50 p-6 rounded-lg border mb-8">
    <h2 className="text-xl font-bold mb-4">Innehållsförteckning</h2>
    <ul className="space-y-2">
      {headings.map((heading) => (
        <li key={heading.slug} className={heading.level === 3 ? 'ml-4' : ''}>
          <a href={`#${heading.slug}`} className="text-blue-600 hover:underline">{heading.text}</a>
        </li>
      ))}
    </ul>
  </div>
);

// Funktion för att rendera relaterade inlägg
const RelatedPosts = ({ posts }: { posts: Awaited<ReturnType<typeof getRelatedPosts>> }) => (
  <div className="mt-16 pt-8 border-t">
    <h2 className="text-3xl font-bold mb-6">Läs även</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/artikel/${post.slug}`} className="block p-4 bg-white border rounded-lg hover:shadow-lg transition-shadow">
          <span className="text-sm font-semibold text-blue-700">{post.category}</span>
          <h3 className="text-lg font-bold mt-2">{post.title}</h3>
        </Link>
      ))}
    </div>
  </div>
);

// Sidan
export default async function ArticlePage({ params }: { params: { articleSlug: string } }) {
  const post = getPostBySlug(params.articleSlug);

  if (!post) {
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);
  const headings = extractHeadings(post.content);
  const relatedPosts = getRelatedPosts(post.category, post.slug);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Brödsmulor */}
      <nav className="text-sm mb-4 text-gray-500">
        <Link href="/" className="hover:underline">Hem</Link>
        <span className="mx-2"></span>
        <Link href="/blogg" className="hover:underline">Blogg</Link>
      </nav>

      <div className="bg-white p-8 rounded-lg shadow-lg border">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="text-md text-gray-500 mt-4 flex items-center gap-4">
            <span>{new Date(post.date).toLocaleDateString('sv-SE', { dateStyle: 'long' })}</span>
            <span className="mx-2">•</span>
            <span>Av: {post.author}</span>
            <span className="mx-2">•</span>
            <span>Lästid: ca {readingTime} min</span>
          </div>
        </header>

        {headings.length > 0 && <TableOfContents headings={headings} />}
        
        <div
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Vi kan lägga till delningsknappar och relaterade inlägg här senare om vi vill */}
      </div>

      {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
    </div>
  );
}

// generateMetadata och generateStaticParams förblir desamma