// src/app/(routes)/blogg/page.tsx
import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import type { Metadata } from 'next';

const blogSchema = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Brottsbloggen - Guider och insikter om brott i Sverige',
  description: 'Läs våra senaste artiklar om brottsförebyggande, guider för anmälan av stöldgods och analyser av brottsstatistik.',
  publisher: {
    '@type': 'Organization',
    name: 'Brottsportalen'
  }
};

export const metadata: Metadata = {
  title: 'Brottsbloggen - Guider och insikter om brott i Sverige',
  description: 'Läs våra senaste artiklar om brottsförebyggande, guider för anmälan av stöldgods och analyser av brottsstatistik.',
  other: {
    'script[type="application/ld+json"]': JSON.stringify(blogSchema),
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold">Brottsbloggen</h1>
        <p className="mt-4 text-xl text-gray-600">
          Analyser, guider och nyheter om brott och säkerhet i Sverige.
        </p>
      </header>

      {/* هنا يمكن إضافة فلاتر للتصنيفات لاحقًا */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link href={`/artikel/${post.slug}`} key={post.id} className="block bg-white p-6 rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2">
              {post.category}
            </span>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="text-sm text-gray-500">
              <span>{new Date(post.date).toLocaleDateString('sv-SE', { dateStyle: 'long' })}</span>
              <span className="mx-2">•</span>
              <span>{post.author}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}