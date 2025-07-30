// src/app/(routes)/integritetspolicy/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Integritetspolicy | Brottsportalen',
  description: 'Läs om hur Brottsportalen hanterar personuppgifter och värnar om din integritet i enlighet med GDPR.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold">Integritetspolicy</h1>
        <p className="text-gray-500 mt-2">Senast uppdaterad: 2025-07-30</p>
      </header>
      
      <div className="prose lg:prose-xl max-w-none">
        <h2>Introduktion</h2>
        <p>
          Denna integritetspolicy beskriver hur Brottsportalen ("vi", "oss", "vår") samlar in, använder och skyddar dina personuppgifter när du använder vår webbplats (brottsportalen.se). Vi värnar om din integritet och följer gällande dataskyddslagar, inklusive GDPR.
        </p>

        <h2>Personuppgiftsansvarig</h2>
        <p>
          Brottsportalen är personuppgiftsansvarig för behandlingen av dina personuppgifter på denna webbplats. För kontakt, vänligen maila oss på <a href="mailto:info@brottsportalen.se">info@brottsportalen.se</a>.
        </p>

        <h2>Vilka uppgifter samlar vi in?</h2>
        <p>Vi samlar in information på följande sätt:</p>
        <ul>
          <li><strong>Information du ger oss:</strong> När du skapar ett konto via vår tredjepartstjänst Clerk, samlas uppgifter som e-postadress och namn in. När du anmäler stulet gods, samlar vi in de uppgifter du anger i formuläret (t.ex. beskrivning av föremål, plats för stöld).</li>
          <li><strong>Information från tredjeparter:</strong> Vi använder Clerk för autentisering, som hanterar dina inloggningsuppgifter på ett säkert sätt.</li>
          <li><strong>Observera (Demo-läge):</strong> I webbplatsens nuvarande demonstrationsläge är all händelsedata syntetisk och inga verkliga personuppgifter från brottsoffer eller misstänkta lagras eller visas.</li>
        </ul>

        <h2>Hur använder vi dina uppgifter?</h2>
        <p>Dina uppgifter används för att:</p>
        <ul>
          <li>Tillhandahålla och administrera ditt användarkonto.</li>
          <li>Publicera och hantera dina anmälningar om stöldgods.</li>
          <li>Kommunicera med dig gällande ditt konto eller dina anmälningar.</li>
          <li>Förbättra och analysera användningen av vår tjänst.</li>
        </ul>

        <h2>Delning av uppgifter</h2>
        <p>
          Vi säljer aldrig dina personuppgifter. Information som du publicerar i en stöldgodsanmälan (förutom din direkta identitet) blir offentlig på vår plattform. Vi delar endast uppgifter med tredjeparter, som Clerk, när det är nödvändigt för att tillhandahålla tjänsten.
        </p>

        <h2>Dina rättigheter</h2>
        <p>
          Du har rätt att begära tillgång till, rättelse av, eller radering av dina personuppgifter. Du kan hantera ditt konto och dina anmälningar via din instrumentpanel (Dashboard) när du är inloggad.
        </p>

        <h2>Ändringar i policyn</h2>
        <p>
          Vi kan komma att uppdatera denna policy. Den senaste versionen kommer alltid att finnas tillgänglig på denna sida.
        </p>
      </div>
    </div>
  );
}