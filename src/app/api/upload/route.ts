// src/app/api/upload/route.ts (النسخة المحسّنة والآمنة)

import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path'; // استيراد extname للحصول على امتداد الملف
import { randomBytes } from 'crypto'; // استيراد crypto لتوليد اسم عشوائي
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
export async function POST(request: NextRequest) {
  // --- KORRIGERING HÄR ---
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // --- التغيير هنا: إنشاء اسم فريد وآمن للملف ---
  // 1. احصل على امتداد الملف الأصلي (مثل .png أو .jpg)
  const fileExtension = extname(file.name);
  // 2. قم بتوليد اسم عشوائي تمامًا
  const randomFileName = randomBytes(16).toString('hex');
  // 3. ادمج الاسم العشوائي مع الامتداد
  const uniqueFilename = `${randomFileName}${fileExtension}`;
  // --- نهاية التغيير ---

  // المسار الذي سيتم حفظ الملف فيه داخل مجلد `public`
  const path = join(process.cwd(), 'public', 'uploads', uniqueFilename);
  
  try {
    // اكتب الملف إلى نظام الملفات
    await writeFile(path, buffer);
    console.log(`File saved to ${path}`);

    // المسار الذي يمكن الوصول إليه från المتصفح
    const publicPath = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ success: true, url: publicPath });

  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
  }
}