'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Check, Image as ImageIcon, Link2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';

import { updateProfile } from '@/lib/db/actions/profile';
import ShaderDemo_ATC from '@/components/effects/shader-atc';
import Image from '@/components/ui/image';

interface Props {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  onClose: () => void;
}

export function ProfileSettingsDialog({ username, bio, avatarUrl, backgroundUrl, onClose }: Props) {
  const router = useRouter();

  const [name, setName] = useState(username);
  const [about, setAbout] = useState(bio ?? '');
  const [avatar, setAvatar] = useState(avatarUrl ?? '');
  const [background, setBackground] = useState(backgroundUrl ?? '');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const initials = name.slice(0, 2).toUpperCase() || 'AL';

  const isDirty =
    name !== username ||
    about !== (bio ?? '') ||
    avatar !== (avatarUrl ?? '') ||
    background !== (backgroundUrl ?? '');

  function focusAvatarUrl() {
    avatarInputRef.current?.focus();
  }

  function focusBackgroundUrl() {
    backgroundInputRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isDirty || saving) {
      return;
    }

    setSaving(true);

    try {
      const result = await updateProfile({
        username: name,
        bio: about,
        avatarUrl: avatar,
        backgroundUrl: background,
      });

      if (!result.success) {
        setError(result.error || 'Произошла ошибка при сохранении');
        setSaving(false);
        return;
      }

      if (result.username !== username) {
        router.replace(`/user/${result.username}`);
      }

      onClose();
    } catch (err) {
      console.error('[Profile] Save failed:', err);
      setError('Произошла непредвиденная ошибка');
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="gap-0 overflow-hidden border-border bg-card p-0 sm:max-w-xl"
        showCloseButton={false}
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="relative">
            <button
              type="button"
              onClick={focusBackgroundUrl}
              className="group relative block h-40 w-full overflow-hidden bg-muted sm:h-48"
            >
              {background ? (
                <img src={background} alt="" className="size-full object-cover opacity-60" />
              ) : (
                <ShaderDemo_ATC />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-background/90 px-4 py-2 text-sm font-medium text-foreground shadow-lg backdrop-blur-md">
                  <Link2 className="size-4" />
                  Изменить фон
                </span>
              </div>
            </button>

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={saving}
              className="absolute right-3 top-3 z-20 rounded-full bg-black/20 text-white hover:bg-black/40 hover:text-white"
              onClick={onClose}
            >
              <X />
            </Button>

            <button
              type="button"
              onClick={focusAvatarUrl}
              className="group absolute -bottom-8 left-6 z-20 size-24 overflow-hidden rounded-[1.25rem] border-2 border-card bg-muted shadow-xl sm:size-28"
            >
              {avatar ? (
                <Image src={avatar} alt="Аватар" fill className="size-full object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center bg-primary/15 text-2xl font-black text-primary">
                  {initials}
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-5 text-white" />
              </div>
            </button>
          </div>

          <div className="px-6 pb-2 pt-12">
            <div className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                AniLyfe
              </p>

              <DialogTitle className="mt-1 text-xl">Настройка профиля</DialogTitle>
            </div>

            <div className="flex flex-col gap-5">
              <label className="flex flex-col gap-2 text-sm font-medium">
                Никнейм
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  minLength={3}
                  maxLength={32}
                  placeholder="your_username"
                  autoComplete="off"
                />
                <span className="text-xs text-muted-foreground">
                  3–32 символа · латиница, цифры, _ и -
                </span>
              </label>

              <label className="flex flex-col gap-2 text-sm font-medium">
                О себе
                <Textarea
                  value={about}
                  onChange={(event) => setAbout(event.target.value)}
                  maxLength={160}
                  rows={3}
                  placeholder="Расскажи немного о себе..."
                  className="resize-none"
                />
                <span className="text-right text-xs text-muted-foreground">{about.length}/160</span>
              </label>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="size-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Изображения</span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">Аватар</span>
                    <Input
                      ref={avatarInputRef}
                      value={avatar}
                      onChange={(event) => setAvatar(event.target.value)}
                      placeholder="https://..."
                      type="url"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">Фон профиля</span>
                    <Input
                      ref={backgroundInputRef}
                      value={background}
                      onChange={(event) => setBackground(event.target.value)}
                      placeholder="https://..."
                      type="url"
                    />
                  </label>
                </div>

                {/* Вывод ошибки */}
                {error && <p className="text-sm font-medium text-destructive mt-2">{error}</p>}
              </div>
            </div>
          </div>

          <DialogFooter className="m-0 mt-4 px-6 py-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
              Отмена
            </Button>

            <Button type="submit" disabled={!isDirty || saving}>
              {saving ? (
                'Сохранение...'
              ) : (
                <>
                  <Check className="mr-2 size-4" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
