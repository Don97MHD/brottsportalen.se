// next.config.js (النسخة المحدّثة بصيغة JavaScript)

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },

   async redirects() {
    return [
      // 1. إعادة توجيه الصفحات الثابتة (محددة جداً)
      {
        source: '/Home/AboutUs',
        destination: '/om-oss',
        permanent: true,
      },
      {
        source: '/offers/register/husvagnsguiden',
        destination: '/stoldgods/anmal',
        permanent: true,
      },
      
      // 2. إعادة توجيه ديناميكية لصفحات الأحداث الفردية (محددة جداً)
      // تلتقط أي رابط يحتوي على 'crimeID' وتوجهه إلى الصفحة الجديدة
      {
        source: '/index.php',
        destination: '/handelse/:crimeID',
        permanent: true,
        has: [{ type: 'query', key: 'crimeID' }],
      },

      // 3. إعادة توجيه لصفحات القوائم والبحث القديمة (أقل تحديداً)
      // أي رابط لـ index.php يحتوي على 'curPage' أو 'kommun' سيذهب إلى خريطة الأحداث الجديدة
      {
        source: '/index.php',
        destination: '/karta',
        permanent: true,
        has: [
          {
            type: 'query',
            key: 'curPage',
          },
        ],
      },
      
      // 4. إعادة توجيه عامة للملفات القديمة (Catch-all)
      // أي رابط آخر لـ index.php أو widget.php لم تتم مطابقته أعلاه سيذهب للصفحة الرئيسية
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/widget.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/widgetSearchSmall.php', // تمت إضافة هذه من قائمتك
        destination: '/',
        permanent: true,
      }
    ];
  },
};

module.exports = nextConfig;