// src/app/(routes)/stoldgods/anmal/StepForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

// تعريف نوع البيانات للنموذج
type FormData = {
  category: string;
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
  stolenDate: string;
  description: string;
  images: FileList;
};

// قائمة الفئات المتاحة
const categories = [
  'Cykel',
  'Elektronik',
  'Smycken',
  'Konst',
  'Verktyg',
  'Övrigt'
];

export default function StepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const { user } = useUser();

  // مراقبة حقل الصور لعرض معاينة للمستخدم
  const watchedImages = watch('images');

  // التأكد من أن المستخدم مسجل دخوله
  if (!user) {
    router.push('/sign-in?redirect_url=/stoldgods/anmal');
    return null; // عرض لا شيء أثناء إعادة التوجيه
  }

  // دالة لمعالجة إرسال النموذج
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      // --- الخطوة 1: رفع الصور إلى الخادم المحلي ---
      const imageUrls: string[] = [];
      if (data.images && data.images.length > 0) {
        // المرور على كل ملف تم اختياره
        for (const file of Array.from(data.images)) {
          const formData = new FormData();
          formData.append('file', file);

          // إرسال الملف إلى API الرفع
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (response.ok) {
            // إضافة المسار العام للصورة إلى مصفوفة الروابط
            imageUrls.push(result.url);
          } else {
            // في حال حدوث خطأ أثناء الرفع
            throw new Error(result.error || 'Image upload failed');
          }
        }
      }

      // --- الخطوة 2: إرسال بيانات النموذج كاملة مع روابط الصور ---
      const response = await fetch('/api/stoldgods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: imageUrls }),
      });

      if (!response.ok) {
        throw new Error('Ett fel uppstod vid registrering av föremålet');
      }

      const newStolenItem = await response.json();
      // إعادة توجيه المستخدم إلى صفحة البلاغ الجديد
      router.push(`/stoldgods/efterlysning/${newStolenItem.id}`);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Ett fel uppstod. Försök igen senare.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // دوال التنقل بين الخطوات
  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      {/* مؤشر التقدم للخطوات */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs text-center text-gray-500">
          <span className={currentStep >= 1 ? 'font-semibold text-blue-600' : ''}>1. Detaljer</span>
          <span className={currentStep >= 2 ? 'font-semibold text-blue-600' : ''}>2. Stöldinfo</span>
          <span className={currentStep >= 3 ? 'font-semibold text-blue-600' : ''}>3. Bilder</span>
          <span className={currentStep >= 4 ? 'font-semibold text-blue-600' : ''}>4. Granska</span>
        </div>
        <div className="relative pt-2">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
            <div 
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
            ></div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* الخطوة 1: تفاصيل الغرض */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Föremålets detaljer</h2>
            <div>
              <label className="block mb-1 text-sm font-medium">Kategori</label>
              <select {...register('category', { required: 'Välj en kategori' })} className="w-full p-2 border rounded-md">
                <option value="">Välj kategori</option>
                {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Märke</label>
              <input type="text" {...register('brand', { required: 'Ange märke' })} className="w-full p-2 border rounded-md" placeholder="T.ex. Samsung, Trek"/>
              {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Modell</label>
              <input type="text" {...register('model')} className="w-full p-2 border rounded-md" placeholder="T.ex. Galaxy S21, FX 3"/>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Serienummer (valfritt)</label>
              <input type="text" {...register('serialNumber')} className="w-full p-2 border rounded-md" placeholder="Om tillgängligt"/>
            </div>
          </div>
        )}

        {/* الخطوة 2: تفاصيل السرقة */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Stölddetaljer</h2>
            <div>
              <label className="block mb-1 text-sm font-medium">Plats för stöld</label>
              <input type="text" {...register('location', { required: 'Ange plats' })} className="w-full p-2 border rounded-md" placeholder="Gatuadress eller område"/>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Datum för stöld</label>
              <input type="date" {...register('stolenDate', { required: 'Ange datum' })} className="w-full p-2 border rounded-md" max={new Date().toISOString().split('T')[0]}/>
              {errors.stolenDate && <p className="text-red-500 text-sm mt-1">{errors.stolenDate.message}</p>}
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Beskrivning</label>
              <textarea {...register('description', { required: 'Lägg till en beskrivning' })} className="w-full p-2 border rounded-md h-32" placeholder="Beskriv föremålet och omständigheterna kring stölden"/>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>
        )}

        {/* الخطوة 3: الصور */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Bilder</h2>
            <div>
              <label htmlFor="image-upload" className="block w-full cursor-pointer p-6 border-2 border-dashed rounded-md text-center text-gray-500 hover:bg-gray-50 hover:border-blue-500 transition-colors">
                Klicka här för att välja bilder
              </label>
              <input id="image-upload" type="file" multiple accept="image/png, image/jpeg" {...register('images')} className="hidden"/>
              <p className="text-sm text-gray-500 mt-2">Du kan ladda upp flera bilder.</p>
            </div>
            {watchedImages && Array.from(watchedImages).length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {Array.from(watchedImages).map((file, index) => (
                  <div key={index} className="relative">
<Image src={URL.createObjectURL(file)} alt={file.name} width={112} height={112} className="w-full h-28 object-cover rounded-md shadow-sm"/>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* الخطوة 4: المراجعة */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Granska och skicka</h2>
            <p className="text-gray-600">
              Kontrollera att all information är korrekt innan du skickar in anmälan.
              Efter inskickad anmälan kommer den att publiceras på webbplatsen.
            </p>
            {/* يمكنك هنا عرض ملخص للبيانات التي أدخلها المستخدم للمراجعة النهائية */}
          </div>
        )}

        {/* أزرار التنقل */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          {currentStep > 1 ? (
            <button type="button" onClick={prevStep} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" disabled={isSubmitting}>
              Föregående
            </button>
          ) : (
            <div></div> // عنصر نائب للحفاظ على التنسيق
          )}
          
          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="px-6 py-2 bg-[#005ea2] text-white rounded-md hover:bg-blue-700" disabled={isSubmitting}>
              Nästa
            </button>
          ) : (
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? 'Skickar...' : 'Skicka anmälan'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}