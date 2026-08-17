import { useState } from 'react';

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
          data: { username },
        },
      });
      if (error) throw error;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { loading, registerWithMagicLink };
}
