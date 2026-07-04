import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { LanguageProvider } from "@/components/providers/language-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export const metadata: Metadata = {
  title: "Intervue AI",
  description: "AI Interview Simulator & Career Coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <LanguageProvider>
            <AppShell>{children}</AppShell>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
