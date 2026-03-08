import { useState } from 'react';
import { addToast } from '@heroui/react';
import { createClient } from '@/lib/supabase/client';

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const registerWithMagicLink = async (email: string, username: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: { username }, // сохраняется в user.user_metadata
        },
      });
      if (error) throw error;
      addToast({
        title: 'Account created!',
        description: 'Check your email to confirm.',
        color: 'success',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      addToast({
        title: 'Registration error',
        description: message,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, registerWithMagicLink };
}
