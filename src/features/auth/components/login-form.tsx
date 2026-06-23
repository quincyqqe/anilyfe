'use client';

import Link from 'next/link';
import { Clapperboard, ShieldCheck, Sparkles } from 'lucide-react';
import { OAuthButtons } from './oauth-buttons';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export function LoginForm() {
  return (
    <section className="w-full max-w-5xl px-2 py-8 pt-24">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-[0_32px_140px_rgba(0,0,0,0.62)] backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/18 blur-3xl" />
          <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-primary-400/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_0%,rgba(255,255,255,0.08),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),transparent_45%)]" />
        </div>

        <div className="relative grid min-h-[34rem] lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 opacity-50"
              style={{ backgroundImage: 'url(/arts/login.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/20" />

            <div className="relative flex h-full flex-col justify-between p-10">
              <motion.div variants={item}>
                <Link
                  href="/"
                  className="inline-flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md transition hover:bg-white/10"
                >
                  <Clapperboard className="h-4 w-4" />
                  AniLyfe
                </Link>
              </motion.div>

              <div className="space-y-6">
                <motion.h2 variants={item} className="text-3xl font-black leading-tight text-white">
                  Вернись к просмотру без потерь
                </motion.h2>

                <motion.p variants={item} className="max-w-sm text-sm leading-6 text-zinc-300">
                  Список аниме, прогресс серий и избранное синхронизируются между устройствами.
                </motion.p>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {[
                    'Синхронизация прогресса',
                    'Личные списки и избранное',
                    'Быстрый доступ к продолжению',
                  ].map((itemText) => (
                    <motion.div
                      key={itemText}
                      variants={item}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300 backdrop-blur-md"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {itemText}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div variants={item} className="text-xs text-zinc-500">
                Твой просмотр продолжается здесь <span className="mx-2 opacity-40">/</span> всё
                синхронизировано
              </motion.div>
            </div>
          </aside>

          <div className="relative flex flex-col justify-center px-5 py-8 sm:px-8 md:px-10 lg:px-12">
            <div className="mx-auto w-full max-w-md space-y-8">
              <motion.div variants={item} className="space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  Вход в профиль
                </p>

                <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">
                  Добро пожаловать обратно
                </h1>

                <p className="max-w-sm text-sm leading-6 text-zinc-400">
                  Войди через сервис, чтобы синхронизировать список аниме, прогресс и избранное.
                </p>
              </motion.div>

              <motion.div variants={item}>
                <OAuthButtons />
              </motion.div>

              <motion.div
                variants={item}
                className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <p className="text-xs leading-6 text-zinc-500">
                  Продолжая вход, ты соглашаешься с{' '}
                  <Link
                    href="/terms"
                    className="font-semibold text-zinc-200 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white"
                  >
                    условиями использования
                  </Link>{' '}
                  и{' '}
                  <Link
                    href="/privacy"
                    className="font-semibold text-zinc-200 underline decoration-white/20 underline-offset-4 transition hover:text-white hover:decoration-white"
                  >
                    политикой конфиденциальности
                  </Link>
                  .
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
