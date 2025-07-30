  // src/app/(routes)/stoldgods/sok/page.tsx
  'use client';

  import { useState, useEffect } from 'react';
  import Link from 'next/link';
  import Image from 'next/image';
  import Head from 'next/head';
  // تعريف نوع البيانات
  interface StolenItem {
    id: string;
    category: string;
    brand: string;
    model: string;
    location: string;
    stolenDate: string;
    images: string[];
  }

  export default function SearchStolenItemsPage() {
    const [searchParams, setSearchParams] = useState({
      query: '',
      category: '',
      location: '',
    });
    const [items, setItems] = useState<StolenItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // دالة لجلب البيانات من الـ API
    const fetchItems = async (params = {}) => {
      try {
        setIsLoading(true);
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`/api/stoldgods?${query}`);
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
        setItems([]); // إفراغ النتائج في حالة حدوث خطأ
      } finally {
        setIsLoading(false);
      }
    };

    // جلب البيانات الأولية عند تحميل الصفحة
    useEffect(() => {
      fetchItems();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      // بناء كائن البحث من الحقول غير الفارغة فقط
      const activeFilters = Object.fromEntries(
        Object.entries(searchParams).filter(([, value]) => value !== '')
      );
      fetchItems(activeFilters);
    };
  const searchPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'SearchResultsPage',
      name: 'Sök efter stulen egendom | Brottsportalen',
      description: 'Sök i vårt register över stöldgods anmält av användare från hela Sverige. Hitta cyklar, elektronik och mer.',
    };

    return (
      <>
        <Head>
          <title>Sök Stöldgods | Brottsportalen</title>
          <meta name="description" content="Sök i vårt register över stöldgods anmält av användare. Hitta cyklar, elektronik och mer." />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(searchPageSchema) }} />
        </Head>
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Sök efter stulen egendom</h1>
          <Link href="/stoldgods/anmal" className="bg-[#005ea2] text-white px-5 py-2 rounded-md hover:bg-[#004e8a] transition-colors whitespace-nowrap">
            + Anmäl stöldgods
          </Link>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sökord</label>
              <input
                type="text"
                value={searchParams.query}
                onChange={e => setSearchParams(prev => ({ ...prev, query: e.target.value }))}
                placeholder="Märke, modell, beskrivning..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={searchParams.category}
                onChange={e => setSearchParams(prev => ({ ...prev, category: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Alla kategorier</option>
                <option value="Cykel">Cykel</option>
                <option value="Elektronik">Elektronik</option>
                <option value="Smycken">Smycken</option>
                <option value="Konst">Konst</option>
                <option value="Verktyg">Verktyg</option>
                <option value="Övrigt">Övrigt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plats</label>
              <input
                type="text"
                value={searchParams.location}
                onChange={e => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Stad eller område"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full sm:w-auto bg-[#005ea2] text-white px-8 py-2 rounded-md hover:bg-[#004e8a] transition-colors" disabled={isLoading}>
            {isLoading ? 'Söker...' : 'Sök'}
          </button>
        </form>

        {isLoading ? (
          <div className="text-center py-12">Laddar...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <Link key={item.id} href={`/stoldgods/efterlysning/${item.id}`} className="block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
            <div className="relative h-48 w-full rounded-t-lg bg-gray-200 overflow-hidden">
      <div className="flex items-center justify-center h-full text-gray-500">Bild kommer snart</div>
  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg truncate pr-2">{item.brand} {item.model}</h3>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{item.category}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                    <p className="text-sm text-gray-500">
                      Stulen: {new Date(item.stolenDate).toLocaleDateString('sv-SE')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {items.length === 0 && (
              <div className="text-center py-20 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold">Inga träffar</h3>
                <p className="text-gray-600 mt-2">Din sökning gav inga resultat. Prova att ändra dina filter.</p>
              </div>
            )}
          </>
        )}
      </div>
        </>
    );
  }