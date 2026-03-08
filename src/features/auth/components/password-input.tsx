'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

export function PasswordInput({
  id,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
      <input
        id={id}
        type={show ? 'text' : 'password'}
        placeholder={placeholder ?? '••••••••'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-lg border border-zinc-800 bg-zinc-950 pl-10 pr-10 py-2 text-sm text-zinc-50 placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-600 transition"
      />
      <button
        type="button"
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-zinc-200 transition-colors"
        onClick={() => setShow((v) => !v)}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
