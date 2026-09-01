'use client';

import { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LogoutButton } from './logout-button';
import { ProfileSettingsDialog } from './profile-settings-dialog';

interface Props {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
}

export function ProfileOwnerActions({ username, bio, avatarUrl, backgroundUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 max-sm:justify-center">
        <Button
          variant="default"
          size="sm"
          onClick={() => setOpen(true)}
          className="h-9 rounded-xl px-3.5"
        >
          <Settings2 />
          Настроить
        </Button>

        <LogoutButton />
      </div>

      {open && (
        <ProfileSettingsDialog
          username={username}
          bio={bio}
          avatarUrl={avatarUrl}
          backgroundUrl={backgroundUrl}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
