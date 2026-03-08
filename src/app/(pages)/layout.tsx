import { ReactNode } from 'react';

import { Navigation } from '@/components/layout/header/navigation';
import { getCurrentUserWithProfile } from '@/lib/db/queries';
import Footer from '@/components/layout/footer/footer';

const PagesLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUserWithProfile();

  return (
    <>
      <Navigation user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PagesLayout;
