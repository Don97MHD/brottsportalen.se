// src/components/DemoNotice.tsx
'use client';

import { useState } from 'react';

export default function DemoNotice() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4" role="alert">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="font-bold">Observera!</p>
          <p className="text-sm">
            Denna webbplats är för närvarande i ett demonstrationsläge. Datan som visas är syntetisk och representerar inte verkliga händelser.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-900 font-bold text-xl"
          aria-label="Dölj meddelande"
        >
          ×
        </button>
      </div>
    </div>
  );
}