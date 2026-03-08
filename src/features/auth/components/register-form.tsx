'use client';

import { useState } from 'react';
import { Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRegister } from '../hooks/use-register';
import { OAuthButtons } from './oauth-buttons';
import { OrSeparator } from './or-separator';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const { loading, registerWithMagicLink } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerWithMagicLink(email, username);
  };

  return (
    <div className="card-animate w-full max-w-sm">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 backdrop-blur shadow-2xl">
        <div className="p-6 pb-0 space-y-1">
          <h2 className="text-2xl font-semibold text-zinc-50">Создать аккаунт</h2>
          <p className="text-sm text-zinc-400">
            Введите данные — мы отправим ссылку для подтверждения
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid gap-5">
          {/* Имя пользователя */}
          <div className="grid gap-2">
            <label htmlFor="reg-username" className="text-sm font-medium text-zinc-300">
              Имя пользователя
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="reg-username"
                type="text"
                placeholder="your_username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                disabled
                maxLength={32}
                className="flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 transition"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="reg-email" className="text-sm font-medium text-zinc-300">
              Электронная почта
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
                className="flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 transition"
              />
            </div>
          </div>

          <div className="text-sm text-zinc-400">
            Временно недоступно. Используйте авторизацию через соцсети.
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-zinc-50 text-zinc-900 text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Отправляем…' : 'Создать аккаунт'}
          </button>

          <OrSeparator />
          <OAuthButtons loading={loading} />
        </form>

        <div className="px-6 pb-6 flex items-center justify-center text-sm text-zinc-400">
          Уже есть аккаунт?
          <Link href="/login" className="ml-1 text-zinc-200 hover:underline">
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
