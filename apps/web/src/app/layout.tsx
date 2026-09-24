import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Учёт личных расходов',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
