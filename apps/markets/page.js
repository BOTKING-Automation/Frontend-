'use client';
import { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/Sidebar';

const SYMBOLS = [
  { label: 'EUR/USD', value: 'FX:EURUSD' },
  { label: 'GBP/USD', value: 'FX:GBPUSD' },
  { label: 'USD/JPY', value: 'FX:USDJPY' },
  { label: 'XAU/USD (Gold)', value: 'OANDA:XAUUSD' },
  { label: 'BTC/USD', value: 'BINANCE:BTCUSDT' },
  { label: 'ETH/USD', value: 'BINANCE:ETHUSDT' },
  { label: 'US30', value: 'FOREXCOM:US30' },
  { label: 'NAS100', value: 'FOREXCOM:NSXUSD' },
];

export default function Markets() {
  const [symbol, setSymbol] = useState(SYMBOLS[0].value);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      backgroundColor: '#0B0F14',
      gridColor: 'rgba(31, 42, 58, 0.5)',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      support_host: 'https://www.tradingview.com',
    });
    containerRef.current.appendChild(script);
  }, [symbol]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display text-2xl font-bold">Live Markets</h1>
          <select className="input w-56" value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            {SYMBOLS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="card-glow p-0 overflow-hidden" style={{ height: '75vh' }}>
          <div ref={containerRef} className="tradingview-widget-container h-full w-full" />
        </div>
      </main>
    </div>
  );
}
