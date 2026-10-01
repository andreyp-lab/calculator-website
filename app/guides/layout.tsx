import type { ReactNode } from 'react';
import { CourseCTA } from '@/components/marketing/CourseCTA';

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <div className="mx-auto max-w-4xl px-4">
        <CourseCTA suppressIfPromoted />
      </div>
    </>
  );
}
