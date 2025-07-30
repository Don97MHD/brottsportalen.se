// src/middleware.ts (النسخة المصححة والنهائية)
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// تحديد المسارات التي تريد حمايتها.
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',   // حماية لوحة التحكم وجميع مساراتها الفرعية
  '/stoldgods/anmal', // حماية صفحة إنشاء بلاغ جديد
]);

export default clerkMiddleware((auth, req) => {
  // التحقق مما إذا كان المسار الحالي محميًا.
  if (isProtectedRoute(req)) {
    // التصحيح هنا: 'auth' هو كائن، وليس دالة.
    // نستخدم التابع .protect() مباشرة على الكائن auth.
    // ستقوم هذه الدالة بإعادة توجيه المستخدم غير المسجل تلقائيًا.
    auth.protect();
  }

  // إذا لم يكن المسار محميًا، أو كان المستخدم مسجلاً ووصل إلى مسار محمي،
  // اسمح للطلب بالمرور.
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};