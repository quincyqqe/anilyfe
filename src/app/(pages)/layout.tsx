import { ReactNode } from 'react';

import { getCurrentUserWithProfile } from '@/lib/db/queries';
import Footer from '@/components/layout/footer/footer';
import { Header } from '@/components/layout/header';

const PagesLayout = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUserWithProfile();

  return (
    <>
      <Header user={user} />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default PagesLayout;
