// src/app/(routes)/om-oss/page.tsx (النسخة المحسّنة)
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om Brottsportalen - Vår mission och vision',
  description: 'Lär dig mer om Brottsportalen, Sveriges ledande plattform för brottsdata. Vi samlar, tolkar och tillgängliggör information för ett tryggare samhälle.',
};

export default function AboutUsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Om Brottsportalen</h1>
        <p className="mt-4 text-xl text-gray-600">
          Vi gör svensk brottsdata tillgänglig, förståelig och användbar.
        </p>
      </header>

      <div className="space-y-12 text-lg leading-relaxed bg-white p-8 rounded-lg shadow-sm border">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center border-b pb-4">Vår Strategiska Roll: Aggregator, Interpretör & Möjliggörare</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-6 text-center">
              <div>
                  <h3 className="font-bold text-xl mb-2">Aggregatorn</h3>
                  <p className="text-base">Vi samlar de senaste händelserna från Polisen och strukturerar dem för att ge dig en klar överblick, istället för ett oändligt flöde.</p>
              </div>
              <div>
                  <h3 className="font-bold text-xl mb-2">Interpretören</h3>
                  <p className="text-base">Vi tar komplex nationell statistik från BRÅ och omvandlar den till tydliga, interaktiva visualiseringar och insikter som alla kan förstå.</p>
              </div>
               <div>
                  <h3 className="font-bold text-xl mb-2">Möjliggöraren</h3>
                  <p className="text-base">Vi fyller tomrummet genom att erbjuda praktiska guider och verktyg, som vårt stöldgodsregister, för att hjälpa och stärka medborgarna.</p>
              </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-4">Vår Mission</h2>
          <p>
            Vår mission på Brottsportalen är att demokratisera tillgången till brottsinformation. Vi tror att ökad kunskap om var och när brott sker är en grundläggande förutsättning för ett effektivt brottsförebyggande arbete och en tryggare vardag för alla i Sverige. Genom att kombinera och förädla data från officiella källor som Polisen och BRÅ, skapar vi en central knutpunkt för alla som söker information om brott och säkerhet.
          </p>
            <p className="mt-4 text-sm text-gray-500 italic">
            All data som visas på denna webbplats i dess nuvarande demonstrationsläge är syntetisk och representerar inte verkliga händelser, i enlighet med dataskyddslagar och etiska riktlinjer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Kontakta Oss</h2>
          <p>
            Har du frågor, feedback eller vill du samarbeta med oss? Vi vill gärna höra från dig. Du kan nå oss på:
            <a href="mailto:info@brottsportalen.se" className="text-blue-600 hover:underline ml-2 font-semibold">
              info@brottsportalen.se
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}