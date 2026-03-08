'use client';

import { Chrome } from 'lucide-react';
import { addToast } from '@heroui/react';
import { createClient } from '@/lib/supabase/client';

interface OAuthButtonsProps {
  loading: boolean;
}

export function OAuthButtons({ loading }: OAuthButtonsProps) {
  const supabase = createClient();

  const handleOAuth = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      addToast({
        title: 'Sign-in error',
        description: message,
        color: 'danger',
      });
    }
  };

  return (
    <div className="grid  gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={() => handleOAuth('google')}
        className="inline-flex items-center justify-center gap-2 h-10 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-50 text-sm font-medium hover:bg-zinc-900/80 transition-colors disabled:opacity-50"
      >
        <Chrome className="h-4 w-4" /> Google
      </button>
    </div>
  );
}
