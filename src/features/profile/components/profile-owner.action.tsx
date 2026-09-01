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
}

export function ProfileOwnerActions({ username, bio, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Settings2 data-icon="inline-start" /> Настроить
        </Button>
        <LogoutButton />
      </div>
      {open && <ProfileSettingsDialog username={username} bio={bio} avatarUrl={avatarUrl} onClose={() => setOpen(false)} />}
    </>
  );
}
