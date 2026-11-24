import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster theme="dark" position="bottom-right" richColors closeButton />
    </>
  );
}
