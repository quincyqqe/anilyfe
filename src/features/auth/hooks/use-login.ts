import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const loginWithMagicLink = async (email: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  return { loading, loginWithMagicLink };
}
