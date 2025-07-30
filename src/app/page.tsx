// src/app/page.tsx (Slutgiltig version med utökat innehåll)
import StatisticsOverview from '@/components/StatisticsOverview';
import Link from 'next/link';
import prisma from '@/lib/prisma';
// För att använda ikoner, importera dem från lucide-react. Du kan behöva installera det om det inte redan är gjort.
// import { Search, Shield, BarChart3 } from 'lucide-react';

interface Event {
  id: string;
  type: string;
  location: string;
  datetime: Date;
}

export default async function Home() {
  const latestEvents: Event[] = await prisma.event.findMany({
    orderBy: { datetime: 'desc' },
    take: 6,
  });

  return (
    <div className="space-y-20"> {/* Ökat avståndet mellan sektionerna */}
      
      {/* --- HJÄLTSEKTION (BEHÅLLS) --- */}
      <section className="text-center py-12 bg-gray-50 rounded-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Sveriges brottsstatistik och senaste händelserna från Polisen</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Utforska aktuell brottsdata, se polisens senaste händelser och hitta verktyg för ett tryggare Sverige. Allt samlat på ett ställe.
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-4">
            <input type="text" placeholder="Sök efter en kommun, t.ex. Stockholm..." className="flex-1 p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <button className="bg-[#005ea2] text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition">Sök</button>
          </div>
        </div>
      </section>

      {/* --- SENASTE HÄNDELSER (BEHÅLLS) --- */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Senaste Händelser från Polisen</h2>
          <Link href="/karta" className="text-[#005ea2] hover:underline">
            Visa alla händelser →
          </Link>
        </div>
        {latestEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestEvents.map((event) => (
              <Link href={`/händelser/${event.id}`} key={event.id} className="block border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-500 transition-all duration-200">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(event.datetime).toLocaleString('sv-SE', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{event.type}</h3>
                <p className="text-gray-700">{event.location}</p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Inga nyliga händelser att visa just nu.</p>
          </div>
        )}
      </section>

      {/* --- NY SEKTION: KÄRNFUNKTIONER --- */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-10">Verktyg för din trygghet</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            {/* <Search className="mx-auto h-12 w-12 text-blue-600 mb-4" /> */}
            <h3 className="text-2xl font-bold mb-3">Sök Stöldgods</h3>
            <p className="text-gray-600 mb-4">Har du hittat något eller funderar på att köpa begagnat? Sök i vårt nationella register för att se om föremålet är anmält stulet.</p>
            <Link href="/stoldgods/sok" className="font-semibold text-[#005ea2] hover:underline">
              Sök i registret →
            </Link>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            {/* <Shield className="mx-auto h-12 w-12 text-blue-600 mb-4" /> */}
            <h3 className="text-2xl font-bold mb-3">Guider & Förebyggande</h3>
            <p className="text-gray-600 mb-4">Lär dig hur du skyddar dig och din egendom. Läs våra checklistor och guider för allt från att säkra hemmet till att agera efter en stöld.</p>
            <Link href="/guider" className="font-semibold text-[#005ea2] hover:underline">
              Läs våra guider →
            </Link>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            {/* <BarChart3 className="mx-auto h-12 w-12 text-blue-600 mb-4" /> */}
            <h3 className="text-2xl font-bold mb-3">Djupgående Analyser</h3>
            <p className="text-gray-600 mb-4">Vi analyserar trender och statistik för att ge dig en djupare förståelse för brottsutvecklingen i Sverige. Läs våra senaste analyser.</p>
            <Link href="/blogg" className="font-semibold text-[#005ea2] hover:underline">
              Utforska analyser →
            </Link>
          </div>
        </div>
      </section>

      {/* --- STATISTIKÖVERSIKT (BEHÅLLS) --- */}
      <section>
        <h2 className="text-3xl font-semibold mb-6">Nationell Brottsstatistik i Sverige</h2>
        <StatisticsOverview />
      </section>

      {/* --- NY SEKTION: UTVALDA ARTIKLAR --- */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Utvalda Guider och Analyser</h2>
          <Link href="/blogg" className="text-[#005ea2] hover:underline">
            Visa alla artiklar →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/artikel/ar-sverige-farligare-nu-en-dataanalys" className="block p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow">
            <span className="text-sm font-semibold text-blue-700">Dataanalys</span>
            <h3 className="text-xl font-bold mt-2 mb-2">Är Sverige farligare nu? En dataanalys av brottsutvecklingen</h3>
            <p className="text-gray-600">Debatten präglas av starka åsikter, men vad säger statistiken? Vi analyserar data från BRÅ och Polisen för att ge en nyanserad bild.</p>
          </Link>
          <Link href="/guider/vad-du-ska-gora-efter-ett-inbrott" className="block p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow">
            <span className="text-sm font-semibold text-blue-700">Guide</span>
            <h3 className="text-xl font-bold mt-2 mb-2">Komplett guide: Vad du ska göra efter ett inbrott</h3>
            <p className="text-gray-600">Att upptäcka att man haft inbrott är en chock. Följ denna steg-för-steg-guide för att hantera situationen korrekt och säkra dina rättigheter.</p>
          </Link>
           <Link href="/artikel/bedragerier-mot-aldre-en-dyster-statistik" className="block p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow">
            <span className="text-sm font-semibold text-blue-700">Dataanalys</span>
            <h3 className="text-xl font-bold mt-2 mb-2">Bedrägerier mot äldre: En dyster statistik och hur vi skyddar våra kära</h3>
            <p className="text-gray-600">Antalet bedrägerier som riktas mot äldre har ökat lavinartat. Vi tittar på de vanligaste metoderna och ger konkreta råd.</p>
          </Link>
           <Link href="/guider/sa-skyddar-du-ditt-hem-mot-inbrott" className="block p-6 bg-white border rounded-lg hover:shadow-lg transition-shadow">
            <span className="text-sm font-semibold text-blue-700">Guide</span>
            <h3 className="text-xl font-bold mt-2 mb-2">Så skyddar du ditt hem mot inbrott: 25 effektiva tips</h3>
            <p className="text-gray-600">Ett bostadsinbrott är varje husägares mardröm. Här är vår ultimata checklista med tips för ett säkrare hem.</p>
          </Link>
        </div>
      </section>

      {/* --- NY SEKTION: VÅR MISSION --- */}
       <section className="text-center py-12 bg-blue-50 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Vår Mission</h2>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Vi på Brottsportalen tror att kunskap är nyckeln till trygghet. Vårt mål är att demokratisera tillgången till brottsdata och ge medborgare de verktyg och den information de behöver för att förstå sin omgivning och skydda sig själva.
        </p>
        <Link href="/om-oss" className="inline-block mt-6 bg-[#005ea2] text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
          Läs mer om oss
        </Link>
      </section>

    </div>
  );
}