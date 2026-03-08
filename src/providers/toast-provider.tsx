'use client';
import { ToastProvider } from '@heroui/toast';

export function AppToastProvider() {
  return (
    <ToastProvider
      toastProps={{
        timeout: 3000,
      }}
    />
  );
}
