// src/lib/guides.ts
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

// تعريف نوع البيانات للدليل
export interface Guide {
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
const guidesDirectory = path.join(process.cwd(), 'data');

export function getAllGuides(): Guide[] {
  const fullPath = path.join(guidesDirectory, 'guides.json');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const guides: Guide[] = JSON.parse(fileContents);

  // فرز الأدلة حسب التاريخ (الأحدث أولاً)
  return guides.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getGuideBySlug(slug: string): Guide | undefined {
  const allGuides = getAllGuides();
  return allGuides.find((guide) => guide.slug === slug);
}


export function calculateReadingTime(content: string): number {
  const text = content.replace(/<[^>]+>/g, '');
  const wordsPerMinute = 200;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function extractHeadings(content: string): Heading[] {
  const $ = cheerio.load(content);
  const headings: Heading[] = [];

  $('h2, h3').each((_, element) => {
    const el = $(element);
    const text = el.text();
    const level = parseInt(el.get(0)!.tagName.substring(1), 10);
    const slug = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    el.attr('id', slug);
    headings.push({ level, text, slug });
  });

  return headings;
}

export function getRelatedGuides(category: string, currentSlug: string): Guide[] {
  return getAllGuides()
    .filter(guide => guide.category === category && guide.slug !== currentSlug)
    .slice(0, 2);
}