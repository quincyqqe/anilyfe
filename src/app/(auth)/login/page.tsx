'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { OAuthButtons } from '@/features/auth/components/oauth-buttons';
import { HeaderLogo } from '@/components/layout/header/header-logo';

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden border-r border-white/10 lg:block">
        <Image
          src="/auth-background.webp"
          alt=""
          fill
          preload
          sizes="50vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/5" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/5 via-transparent to-background/45" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex min-h-screen flex-col p-10 xl:p-12">
          <HeaderLogo />

          <div className="mt-auto max-w-2xl pb-4">
            <div className="mb-5 h-px w-10 bg-primary/70" />

            <blockquote>
              <p className="max-w-2xl text-[clamp(1.5rem,2.4vw,2.35rem)] font-medium font-bold leading-[1.18] tracking-[-0.03em] text-white">
                Всё, что ты смотришь, остаётся с тобой.
              </p>

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/55">
                Сохраняй прогресс, собирай свою библиотеку и продолжай просмотр с любого устройства.
              </p>

             
            </blockquote>
          </div>
        </div>
      </section>

      <section className="relative flex min-h-screen flex-col justify-center px-5 py-16 sm:px-8 lg:px-12 xl:px-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 size-[32rem] rounded-full bg-primary/[0.07] blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 size-80 rounded-full bg-primary/[0.035] blur-[100px]" />
        </div>

        <Link
          href="/"
          className="group absolute left-5 top-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:left-8 lg:left-12"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          Главная
        </Link>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <HeaderLogo />
          </div>

          <header className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-primary/80">
              Ваш аккаунт
            </p>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-foreground">
              Добро пожаловать
            </h1>

            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
              Войдите, чтобы синхронизировать библиотеку, прогресс просмотра и избранное.
            </p>
          </header>

          <div className="space-y-3">
            <OAuthButtons />
          </div>

          <p className="mt-8 text-center text-xs leading-5 text-muted-foreground/60">
            Продолжая, вы соглашаетесь с{' '}
            <Link
              href="/terms"
              className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              условиями использования
            </Link>{' '}
            и{' '}
            <Link
              href="/privacy"
              className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground"
            >
              политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
