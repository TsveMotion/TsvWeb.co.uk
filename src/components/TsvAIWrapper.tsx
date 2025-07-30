'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

// Dynamically import the TsvAI component with no SSR
const TsvAI = dynamic(() => import('./TsvAI'), { ssr: false });

export default function TsvAIWrapper() {
  const pathname = usePathname();
  
  // Don't show the AI assistant in admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <TsvAI />;
}
