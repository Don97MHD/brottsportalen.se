// src/app/(routes)/statistik/page.tsx (Slutgiltig version med utökat textinnehåll)
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; // Importera CardDescription
import Link from 'next/link';

// Types for our data
interface CrimeStat {
  type: string;
  count: number;
}

interface MonthlyTrend {
  month: string;
  count: number;
}

interface KeyStats {
    total: number;
    mostCommon: string;
    trend: number;
}

const NationalStatisticsPage = () => {
  const [keyStats, setKeyStats] = useState<KeyStats | null>(null);
  const [crimeDistribution, setCrimeDistribution] = useState<CrimeStat[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/statistics/national');
      if (!response.ok) {
        throw new Error('Det gick inte att hämta nationell statistik.');
      }
      const data = await response.json();
      setKeyStats(data.keyStats);
      setCrimeDistribution(data.crimeDistribution);
      setMonthlyTrend(data.monthlyTrend);
    } catch (error) {
        setError(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20">Laddar nationell statistik...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-xl font-semibold text-red-700">Ett fel inträffade</h3>
        <p className="text-red-600 mt-2 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Försök igen
        </button>
      </div>
    );
  }
  
  if (!keyStats) {
      return <div className="text-center py-20">Ingen statistikdata att visa.</div>;
  }

  return (
    <div className="space-y-12"> {/* Ökat avstånd */}
      <header className="text-center">
        <h1 className="text-4xl font-bold">Nationell Brottsstatistik för Sverige</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          Här presenteras en översikt av brottsläget i Sverige baserat på aggregerad och anonymiserad händelsedata. Siffrorna ger en ögonblicksbild av trender och fördelning av de vanligaste brottstyperna.
        </p>
      </header>
      
      {/* --- UTÖKAD SEKTION: Nyckeltal --- */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-center">Nyckeltal: Senaste 30 Dagarna</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Totalt antal händelser</CardTitle>
              <CardDescription>Antal rapporterade händelser under den senaste 30-dagarsperioden.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#005ea2]">{keyStats.total.toLocaleString('sv-SE')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Vanligaste brottstyp</CardTitle>
              <CardDescription>Den mest frekvent förekommande brottskategorin just nu.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-[#005ea2]">{keyStats.mostCommon}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Månadstrend</CardTitle>
              <CardDescription>Förändring jämfört med föregående 30-dagarsperiod.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={`text-4xl font-bold ${keyStats.trend >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {keyStats.trend > 0 ? '+' : ''}{keyStats.trend.toFixed(1)}%
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* --- UTÖKAD SEKTION: Diagram --- */}
      <section>
         <h2 className="text-3xl font-semibold mb-6 text-center">Visuell Dataanalys</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Brottsfördelning</CardTitle>
              <CardDescription>Visar hur de olika brottstyperna fördelar sig procentuellt under de senaste 30 dagarna. Detta hjälper till att identifiera vilka typer av brott som är mest framträdande i den aktuella lägesbilden.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crimeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#005ea2" name="Antal" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Brottstrend över tid</CardTitle>
              <CardDescription>Illustrerar utvecklingen av det totala antalet rapporterade händelser månad för månad under det senaste halvåret. Linjediagrammet gör det enkelt att se om brottsligheten trendar uppåt eller nedåt.</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#005ea2" strokeWidth={2} name="Antal brott" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* --- NY SEKTION: FAQ OCH ANSVARSFRISKRIVNING --- */}
      <section className="max-w-3xl mx-auto mt-16 p-8 bg-gray-50 rounded-lg border">
        <h2 className="text-2xl font-semibold mb-6 text-center">Om Statistiken</h2>
        <div className="space-y-6 text-gray-700">
          <div>
            <h3 className="font-semibold">Var kommer datan ifrån?</h3>
            <p>Statistiken på denna sida är genererad från den syntetiska händelsedata som finns i vår databas för detta demonstrationsprojekt. I en verklig applikation skulle datan baseras på öppna data från Polismyndigheten och Brottsförebyggande rådet (BRÅ).</p>
          </div>
          <div>
            <h3 className="font-semibold">Hur ska jag tolka dessa siffror?</h3>
            <p>Siffrorna ska ses som en indikation på trender och mönster, inte som en exakt vetenskaplig sanning. Anmälningsbenägenhet och polisens rapporteringsrutiner kan påverka statistiken. Använd datan som ett underlag för att förstå den övergripande bilden.</p>
          </div>
          <div>
            <h3 className="font-semibold">Var kan jag hitta mer djupgående analyser?</h3>
            <p>För mer detaljerade insikter och analyser av specifika brottstyper och trender, rekommenderar vi att du besöker vår <Link href="/blogg" className="text-blue-600 hover:underline">bloggsektion</Link>.</p>
          </div>
          <div className="pt-4 border-t mt-6">
            <p className="text-sm text-gray-500 italic">
              <strong>Ansvarsfriskrivning:</strong> All data på denna sida är för demonstrationsändamål och ska inte användas som underlag för beslutsfattande. Brottsportalen tar inget ansvar för eventuella felaktigheter i den presenterade informationen.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NationalStatisticsPage;