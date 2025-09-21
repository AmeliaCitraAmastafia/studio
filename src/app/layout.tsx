import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/use-auth';
import { BookingProvider } from '@/hooks/use-bookings';
import { LogProvider } from '@/hooks/use-logs';

export const metadata: Metadata = {
  title: "Hotel ra'as",
  description: 'Your tranquil getaway awaits.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", process.env.NODE_ENV === "development" ? "debug-screens" : undefined)}>
        <AuthProvider>
          <LogProvider>
            <BookingProvider>
              {children}
              <Toaster />
            </BookingProvider>
          </LogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
