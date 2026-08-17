import Link from 'next/link';
import { CompassIcon, HomeIcon } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] w-full items-center justify-center px-6">
      <Empty>
        <EmptyHeader>
          <EmptyTitle className="text-9xl font-extrabold tracking-tighter">404</EmptyTitle>

          <EmptyDescription className="max-w-md text-balance">
            The page you're looking for might have been moved or doesn't exist.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <div className="flex items-center justify-center gap-2">
            <Link href="/" className={buttonVariants()}>
              <HomeIcon />
              Домой
            </Link>

            <Link href="/catalog" className={cn(buttonVariants({ variant: 'outline' }))}>
              <CompassIcon />
              Каталог
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </main>
  );
}
