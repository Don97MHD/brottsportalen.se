// src/app/(routes)/anvandarvillkor/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Användarvillkor | Brottsportalen',
  description: 'Läs igenom våra användarvillkor som reglerar din användning av Brottsportalen.se och dess tjänster.',
};

export default function TermsOfServicePage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">Användarvillkor</h1>
        <p className="text-gray-500 mt-2">Senast uppdaterad: 2025-07-30</p>
      </header>
      
      <div className="prose lg:prose-xl max-w-none">
        <h2>1. Godkännande av villkor</h2>
        <p>
          Genom att använda webbplatsen Brottsportalen.se ("Tjänsten") godkänner du att följa och vara bunden av dessa användarvillkor. Om du inte godkänner villkoren, vänligen avstå från att använda Tjänsten.
        </p>

        <h2>2. Tjänstens natur (Demonstrationsläge)</h2>
        <p>
          Du förstår och accepterar att Tjänsten för närvarande är i ett <strong>demonstrationsläge</strong>. All data gällande brottshändelser och statistik är syntetisk och genererad för teständamål. Den representerar inte verkliga händelser eller individer. Användarinnehåll, såsom anmälningar om stöldgods, är dock verkligt och skapat av användare.
        </p>

        <h2>3. Användarkonto och ansvar</h2>
        <p>
          För att använda vissa delar av Tjänsten, såsom att anmäla stöldgods, måste du skapa ett konto. Du ansvarar för att hålla dina inloggningsuppgifter säkra och för all aktivitet som sker på ditt konto. Du får inte använda Tjänsten för olagliga eller obehöriga ändamål.
        </p>

        <h2>4. Användarinnehåll</h2>
        <p>
          När du skapar en anmälan om stulet gods ("Användarinnehåll"), är du fullt ansvarig för innehållet. Du garanterar att du har rätt att publicera informationen och att den är sanningsenlig. Vi förbehåller oss rätten att granska och ta bort innehåll som vi anser strider mot dessa villkor eller svensk lag.
        </p>

        <h2>5. Ansvarsfriskrivning</h2>
        <p>
          Tjänsten tillhandahålls "i befintligt skick". Vi ger inga garantier för att informationen (särskilt den syntetiska datan) är korrekt eller fullständig. Vi ansvarar inte för några direkta eller indirekta skador som uppstår från din användning av Tjänsten.
        </p>
        
        <h2>6. Ändringar i villkoren</h2>
        <p>
          Vi förbehåller oss rätten att när som helst ändra dessa villkor. Vi kommer att meddela om väsentliga ändringar. Din fortsatta användning av Tjänsten efter sådana ändringar utgör ditt godkännande av de nya villkoren.
        </p>

        <h2>7. Kontakt</h2>
        <p>
          Om du har frågor om dessa villkor, vänligen kontakta oss på <a href="mailto:info@brottsportalen.se">info@brottsportalen.se</a>.
        </p>
      </div>
    </div>
  );
}