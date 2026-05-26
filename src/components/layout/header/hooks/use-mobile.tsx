'use client'

import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  const media = window.matchMedia('(max-width: 768px)')

  media.addEventListener('change', callback)
  return () => media.removeEventListener('change', callback)
}

function getSnapshot() {
  return window.matchMedia('(max-width: 768px)').matches
}

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
