// src/lib/blog.ts
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// تعريف نوع البيانات للمقالة
export interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
}

export interface Heading {
  level: number;
  text: string;
  slug: string;
}
const postsDirectory = path.join(process.cwd(), 'data');

export function getAllPosts(): Post[] {
  const fullPath = path.join(postsDirectory, 'blog.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const posts: Post[] = JSON.parse(fileContents);

  // فرز المقالات حسب التاريخ (الأحدث أولاً)
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | undefined {
  const allPosts = getAllPosts();
  return allPosts.find((post) => post.slug === slug);
}
export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, ''); // Ta bort HTML-taggar
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Extraherar H2- och H3-rubriker för innehållsförteckning
export function extractHeadings(content: string): Heading[] {
  const $ = cheerio.load(content);
  const headings: Heading[] = [];

  $('h2, h3').each((_, element) => {
    const el = $(element);
    const text = el.text();
    const level = parseInt(el.get(0)!.tagName.substring(1), 10);
    // Skapa en "slug" för ankar-länken
    const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    
    // Lägg till ett id till rubriken i HTML-innehållet
    el.attr('id', slug);

    headings.push({ level, text, slug });
  });

  // Returnera både de extraherade rubrikerna och det modifierade innehållet
  return headings;
}

// Hittar relaterade inlägg baserat på kategori
export function getRelatedPosts(category: string, currentSlug: string): Post[] {
  return getAllPosts()
    .filter(post => post.category === category && post.slug !== currentSlug)
    .slice(0, 2); // Hämta de 2 mest relevanta
}