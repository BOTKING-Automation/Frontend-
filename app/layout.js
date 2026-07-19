import './globals.css';
import SupportWidget from '../components/SupportWidget';

export const metadata = {
  title: 'KingBot - Automated Trading Platform',
  description: 'Connect your broker, automate your strategy, trade with discipline.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SupportWidget />
      </body>
    </html>
  );
}
