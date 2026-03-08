'use client';
import { useState, useCallback } from 'react';

export function useHeaderModals() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen((p) => !p), []);

  return { isLoginOpen, isSearchOpen, openLogin, closeLogin, toggleSearch };
}
