import { useState } from 'react';
import { addToast } from '@heroui/react';
import { createClient } from '@/lib/supabase/client';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const loginWithMagicLink = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      addToast({ title: 'Welcome back!', color: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      addToast({
        title: 'Sign-in error',
        description: message,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, loginWithMagicLink };
}
