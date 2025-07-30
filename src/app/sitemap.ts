// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { getAllGuides } from '@/lib/guides';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.brottsportalen.se'; // استخدم رابط موقعك الفعلي

  // إضافة الصفحات الثابتة
  const staticRoutes = [
    '/',
    '/karta',
    '/statistik',
    '/stoldgods/sok',
    '/guider',
    '/blogg',
    '/om-oss',
    '/integritetspolicy',
    '/anvandarvillkor',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // إضافة صفحات المقالات (Blogg)
  const posts = getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/artikel/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  // إضافة صفحات الأدلة (Guider)
  const guides = getAllGuides();
  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/guider/${guide.slug}`,
    lastModified: new Date(guide.date),
  }));

  // (اختياري) إضافة صفحات الأحداث إذا كانت مهمة للـ SEO
  // const events = await prisma.event.findMany({ take: 1000, orderBy: { datetime: 'desc' } });
  // const eventRoutes = events.map(event => ({
  //   url: `${baseUrl}/handelse/${event.id}`,
  //   lastModified: new Date(event.datetime),
  // }));

  return [...staticRoutes, ...postRoutes, ...guideRoutes];
}