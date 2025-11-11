import type { Metadata } from 'next';
import { ReduxProvider } from '@/components/providers/ReduxProvider';

export const metadata: Metadata = {
  title: 'Coworking Café',
  description: 'Coworking space and café in Strasbourg',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
