import type { Metadata } from 'next';
import '../src/styles/globals.css';
import { StoreProvider } from '@/src/providers/StoreProvider';

export const metadata: Metadata = {
  title: 'NEET Predictor | College Prediction & Counseling Hub',
  description: 'Complete NEET counseling platform with college predictor, cut-off data, mock tests, and expert forum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
