'use client';

import { useState } from 'react';
import { addToast } from '@heroui/react';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

type OAuthProvider = 'google' | 'discord';

interface OAuthButtonsProps {
  loading?: boolean;
}

const providers: Array<{
  id: OAuthProvider;
  label: string;
  caption: string;
  icon: string;
  accentClass: string;
}> = [
  {
    id: 'google',
    label: 'Продолжить с Google',
    caption: 'Быстрый вход через Google аккаунт',
    icon: '/icons/google.svg',
    accentClass: 'group-hover:border-sky-300/30 group-hover:bg-sky-300/8',
  },
  {
    id: 'discord',
    label: 'Продолжить с Discord',
    caption: 'Войти через Discord профиль',
    icon: '/icons/discord.svg',
    accentClass: 'group-hover:border-indigo-300/30 group-hover:bg-indigo-300/10',
  },
];

export function OAuthButtons({ loading = false }: OAuthButtonsProps) {
  const supabase = createClient();
  const [pendingProvider, setPendingProvider] = useState<OAuthProvider | null>(null);
  const isBusy = loading || pendingProvider !== null;

  const handleOAuth = async (provider: OAuthProvider) => {
    try {
      setPendingProvider(provider);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/auth/callback` },
      });

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось начать вход.';

      addToast({
        title: 'Ошибка входа',
        description: message,
        color: 'danger',
      });

      setPendingProvider(null);
    }
  };

  return (
    <div className="grid gap-3">
      {providers.map((provider) => {
        const isPending = pendingProvider === provider.id;

        return (
          <button
            key={provider.id}
            type="button"
            disabled={isBusy}
            onClick={() => handleOAuth(provider.id)}
            className={cn(
              'group relative flex min-h-16 w-full items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] px-4 text-left shadow-[0_1px_0_rgba(255,255,255,0.05)_inset] transition duration-300 hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.07] hover:shadow-[0_18px_50px_rgba(0,0,0,0.32)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-60',
              provider.accentClass,
            )}
            aria-label={provider.label}
          >
            <span className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-white/8 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />

            <span className="relative z-10 flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950/75">
                <img src={provider.icon} alt="" className="h-5 w-5" loading="lazy" />
              </span>

              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{provider.label}</span>
                <span className="mt-0.5 block text-xs leading-5 text-zinc-500">
                  {isPending ? 'Переходим к провайдеру...' : provider.caption}
                </span>
              </span>
            </span>

            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-white/70 transition duration-300 group-hover:bg-white group-hover:text-zinc-950">
              {isPending ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
