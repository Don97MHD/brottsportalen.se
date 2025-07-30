// src/app/(routes)/stoldgods/anmal/page.tsx
'use client';

import { SignedIn, SignedOut } from '@clerk/nextjs';
import Link from 'next/link';
import StepForm from './StepForm';

export default function ReportStolenItemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Anmäl stulet föremål</h1>
      <p className="text-gray-600 mb-8">
        Genom att anmäla ditt stulna föremål här ökar du chansen att få tillbaka det.
        Vi rekommenderar att du även gör en polisanmälan.
      </p>

      <SignedIn>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <StepForm />
        </div>
      </SignedIn>

      <SignedOut>
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold mb-4">Logga in för att anmäla</h2>
          <p className="text-gray-600 mb-6">
            Du behöver vara inloggad för att anmäla ett stulet föremål. 
            Detta hjälper oss att hålla kontakt med dig och uppdatera dig om ditt ärende.
          </p>
          <Link 
            href="/sign-in?redirect_url=/stoldgods/anmal"
            className="inline-block px-6 py-3 bg-[#005ea2] text-white rounded-md hover:bg-[#004e8a] transition-colors"
          >
            Logga in
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}