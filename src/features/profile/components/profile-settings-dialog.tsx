'use client';

import { useState, type FormEvent } from 'react';
import { Check, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

interface Props {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  onClose: () => void;
}

export function ProfileSettingsDialog({ username, bio, avatarUrl, onClose }: Props) {
  const [name, setName] = useState(username);
  const [about, setAbout] = useState(bio ?? '');
  const [avatar, setAvatar] = useState(avatarUrl ?? '');
  const [saved, setSaved] = useState(false);
  const initials = name.slice(0, 2).toUpperCase() || 'AL';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section aria-labelledby="profile-settings-title" role="dialog" aria-modal="true" className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-card shadow-2xl">
        <header className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">Identity lab</p>
            <h2 id="profile-settings-title" className="mt-1 text-lg font-semibold text-foreground">Настройка профиля</h2>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="Закрыть" onClick={onClose}><X data-icon="inline-start" /></Button>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-background/40 p-4">
            <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary/15 text-lg font-bold text-primary">
              {avatar ? <img src={avatar} alt="Предпросмотр аватара" className="size-full object-cover" /> : initials}
            </div>
            <div className="min-w-0"><p className="text-sm font-medium text-foreground">Твой визуальный след</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Пока изменения только в этом окне — подключим сохранение позже.</p></div>
          </div>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">Ссылка на аватар<Input value={avatar} onChange={(event) => setAvatar(event.target.value)} placeholder="https://..." /></label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">Никнейм<Input value={name} onChange={(event) => setName(event.target.value)} maxLength={32} /></label>
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">Bio<Textarea value={about} onChange={(event) => setAbout(event.target.value)} maxLength={160} rows={4} placeholder="Расскажи, что сейчас смотришь..." /><span className="text-right text-xs text-muted-foreground">{about.length}/160</span></label>
          <div className="flex items-center justify-end gap-2 pt-1"><Button type="button" variant="ghost" onClick={onClose}>Отмена</Button><Button type="submit">{saved ? <><Check data-icon="inline-start" />Сохранено визуально</> : <><ImagePlus data-icon="inline-start" />Применить</>}</Button></div>
        </form>
      </section>
    </div>
  );
}

export function profilePreviewClass(active: boolean) {
  return cn('transition-colors', active && 'text-primary');
}
