'use client';
import { HeroUIProvider } from '@heroui/react';

export function UIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
