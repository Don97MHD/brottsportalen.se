// src/app/layout.tsx (النسخة النهائية مع تعديل اسم "Blogg")
'use client'; 
import Head from 'next/head';
import './globals.css';
import { Inter } from 'next/font/google';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton
} from '@clerk/nextjs';
import React, { useState } from 'react'; 
import Link from 'next/link';
import DemoNotice from '@/components/DemoNotice';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Brottsportalen',
    url: 'https://www.brottsportalen.se', // استخدم رابط موقعك الفعلي هنا
    logo: 'https://www.brottsportalen.se/logo.svg', // استخدم رابط موقعك الفعلي هنا
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'info@brottsportalen.se',
      contactType: 'Customer Service'
    }
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.brottsportalen.se', // استخدم رابط موقعك الفعلي هنا
    name: 'Brottsportalen',
    description: 'Utforska aktuell och historisk brottsstatistik från hela Sverige. En pålitlig källa för brottsdata och analyser.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.brottsportalen.se/stoldgods/sok?query={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
  return (
    <ClerkProvider>
      <html lang="sv" className="h-full">
        <body className={`${inter.className} flex flex-col min-h-full`}>
          <header className="bg-[#005ea2] text-white py-4 relative">
            <nav className="container mx-auto px-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2" aria-label="Brottsportalen Hemsida" onClick={() => setIsMenuOpen(false)}>
                  <Image 
                    src="/logo.svg"
                    alt="Brottsportalen Logo"
                    width={80}
                    height={80}
                    priority
                  />
                  <span className="text-2xl font-bold hidden sm:inline">Brottsportalen</span>
                </Link>

                {/* --- قائمة سطح المكتب (تختفي على الموبايل) --- */}
                <div className="hidden md:flex items-center space-x-6">
                  <Link href="/karta" className="hover:text-gray-200">Händelser</Link>
                  <Link href="/statistik" className="hover:text-gray-200">Statistik</Link>
                  <Link href="/stoldgods/sok" className="hover:text-gray-200">Stöldgods</Link>
                  <Link href="/guider" className="hover:text-gray-200">Guider</Link>
                  {/* --- التغيير هنا --- */}
                  <Link href="/blogg" className="hover:text-gray-200">Blogg</Link> 
                  <Link href="/om-oss" className="hover:text-gray-200">Om oss</Link>
                  
                  <SignedIn>
                    <div className="flex items-center space-x-6">
                      <a href="/dashboard" className="text-sm font-medium hover:text-gray-200">
                        Mina anmälningar
                      </a>
                      <UserButton />
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <div className="flex items-center gap-4">
                      <SignInButton mode="modal">
                        <button className="hover:text-gray-200 transition">Logga in</button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="bg-white text-[#005ea2] px-4 py-1.5 rounded-md hover:bg-gray-200 transition text-sm font-semibold">Skapa konto</button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                </div>
                {/* --- END: قائمة سطح المكتب --- */}

                {/* --- زر الهامبرغر (يظهر فقط على الموبايل) --- */}
                <div className="md:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Öppna meny">
                    {isMenuOpen ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* --- قائمة الموبايل المنسدلة --- */}
              {isMenuOpen && (
                <div className="md:hidden mt-4 bg-[#005ea2]">
                  <div className="flex flex-col space-y-4 px-2 pt-2 pb-3">
                    <Link href="/karta" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Händelser</Link>
                    <Link href="/statistik" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Statistik</Link>
                    <Link href="/stoldgods/sok" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Stöldgods</Link>
                    <Link href="/guider" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Guider</Link>
                    {/* --- التغيير هنا --- */}
                    <Link href="/blogg" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Blogg</Link> 
                    <Link href="/om-oss" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>Om oss</Link>
                    
                    <div className="border-t border-blue-500 pt-4 mt-4">
                      <SignedIn>
                        <div className="flex flex-col space-y-4">
                           <a href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                            Mina anmälningar
                          </a>
                          <div className="px-3">
                            <UserButton />
                          </div>
                        </div>
                      </SignedIn>
                      <SignedOut>
                        <div className="flex flex-col space-y-4">
                           <SignInButton mode="modal">
                            <button className="w-full text-left block px-3 py-2 rounded-md hover:bg-blue-700 transition">Logga in</button>
                          </SignInButton>
                          <SignUpButton mode="modal">
                            <button className="w-full text-left bg-white text-[#005ea2] px-3 py-2 rounded-md hover:bg-gray-200 transition font-semibold">Skapa konto</button>
                          </SignUpButton>
                        </div>
                      </SignedOut>
                    </div>
                  </div>
                </div>
              )}
              {/* --- END: قائمة الموبايل --- */}
            </nav>
          </header>
          <DemoNotice /> 
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          
          {/* --- START: Nya professionella footern --- */}
          <footer className="bg-gray-800 text-white mt-16">
            <div className="container mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Kolumn 1: Huvudaxlar */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">Huvudsektioner</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/karta" className="hover:text-blue-400 transition-colors">Aktuella Händelser</Link></li>
                    <li><Link href="/statistik" className="hover:text-blue-400 transition-colors">Brottsstatistik</Link></li>
                    <li><Link href="/guider" className="hover:text-blue-400 transition-colors">Guider & Hjälp</Link></li>
                    <li><Link href="/stoldgods/sok" className="hover:text-blue-400 transition-colors">Sök Stöldgods</Link></li>
                  </ul>
                </div>

                {/* Kolumn 2: Viktiga Guider */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">Viktiga Guider</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/guider/vad-du-ska-gora-efter-ett-inbrott" className="hover:text-blue-400 transition-colors">Vad göra efter inbrott</Link></li>
                    <li><Link href="/guider/basta-cykellaset-test-2024" className="hover:text-blue-400 transition-colors">Bästa Cykellåset 2024</Link></li>
                    <li><Link href="/guider/sa-skyddar-du-ditt-hem-mot-inbrott" className="hover:text-blue-400 transition-colors">Skydda ditt hem</Link></li>
                    <li><Link href="/guider/hur-man-anmaler-ett-brott-till-polisen-online" className="hover:text-blue-400 transition-colors">Anmäla brott online</Link></li>
                  </ul>
                </div>

                {/* Kolumn 3: Viktiga Analyser */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">Intressanta Analyser</h3>
     <ul className="space-y-2 text-gray-400">
    {/* الروابط الصحيحة هنا */}
    <li><Link href="/artikel/ar-sverige-farligare-nu-en-dataanalys" className="hover:text-blue-400 transition-colors">Är Sverige farligare nu?</Link></li>
    <li><Link href="/guider/lista-sveriges-utsatta-omraden" className="hover:text-blue-400 transition-colors">Utsatta områden i Sverige</Link></li>
    <li><Link href="/artikel/ungdomsran-i-sverige-statistik-och-trender" className="hover:text-blue-400 transition-colors">Statistik: Ungdomsrån</Link></li>
    <li><Link href="/artikel/cykelstolder-statistik-sverige-fakta-och-trender" className="hover:text-blue-400 transition-colors">Statistik: Cykelstölder</Link></li>
  </ul>
                </div>

                {/* Kolumn 4: Om Oss */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-4">Om Brottsportalen</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link href="/om-oss" className="hover:text-blue-400 transition-colors">Om Oss</Link></li>
                    <li><a href="mailto:info@brottsportalen.se" className="hover:text-blue-400 transition-colors">Kontakta oss</a></li>
                    <li><Link href="/integritetspolicy" className="hover:text-blue-400 transition-colors">Integritetspolicy</Link></li>
                    <li><Link href="/anvandarvillkor" className="hover:text-blue-400 transition-colors">Användarvillkor</Link></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-bold">Brottsportalen</h2>
                  <p className="text-gray-400 mt-1 text-sm">Sveriges plattform för brottsdata och trygghet.</p>
                </div>
                <p className="text-sm text-gray-500 mt-4 md:mt-0">
                  © {new Date().getFullYear()} Brottsportalen.se. Alla rättigheter förbehållna.
                </p>
              </div>
            </div>
          </footer>
          {/* --- END: Nya professionella footern --- */}
        </body>
      </html>
    </ClerkProvider>
  );
}