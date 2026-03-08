'use client';

import { LogoutButton } from './logout-button';

export function ProfileOwnerActions() {
  return (
    <div className="flex items-center gap-3">
      <LogoutButton />
    </div>
  );
}
