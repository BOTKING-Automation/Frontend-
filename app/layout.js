import './globals.css';

export const metadata = {
  title: 'KingBot - Automated Trading Platform',
  description: 'Connect your broker, automate your strategy, trade with discipline.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
