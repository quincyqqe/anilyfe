'use client';
import { ToastProvider } from '@heroui/react';

export function AppToastProvider() {
  return (
    <ToastProvider
      toastProps={{
        timeout: 3000,
      }}
    />
  );
}
