import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  return (
    <form action="/auth/signout" method="POST">
      <Button type="submit" variant="destructive" size="sm" className="h-9 rounded-xl px-3.5">
        <LogOut />
        Выйти
      </Button>
    </form>
  );
}
