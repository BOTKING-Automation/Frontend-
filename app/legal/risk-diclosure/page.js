import Sidebar from '../../../components/Sidebar';

export default function RiskDisclosure() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Risk Disclosure Statement</h1>
        <div className="card space-y-4 text-sm text-muted leading-relaxed">
          <p><strong className="text-white">1. General Risk of Trading.</strong> Trading foreign exchange, CFDs, commodities, and other leveraged instruments carries a high level of risk and may not be suitable for all investors. You may lose some or all of your invested capital, and losses can exceed your initial deposit where leverage is used. You should not trade with money you cannot afford to lose.</p>
          <p><strong className="text-white">2. Automated Trading Risk.</strong> KingBot provides tools to configure and run automated trading strategies. No strategy, algorithm, or automated system guarantees profit or protection against loss. Past performance of any strategy, whether in demo or live mode, is not indicative of future results. Market conditions can change strategy behavior in ways that increase losses.</p>
          <p><strong className="text-white">3. Demo Mode Limitations.</strong> Demo mode uses real market data but simulated order fills. It does not account for slippage, requotes, execution latency, or liquidity constraints that occur in live trading. Performance in demo mode may not be replicated in live mode.</p>
          <p><strong className="text-white">4. Broker Relationship.</strong> KingBot is not a broker, dealer, or custodian of client funds. When you connect an MT4/MT5 account, you are trading directly through your own broker under the terms of your agreement with that broker. KingBot facilitates connectivity and strategy execution instructions only.</p>
          <p><strong className="text-white">5. No Investment Advice.</strong> Nothing on this platform, including strategy templates, educational content, or the AI support agent, constitutes financial, investment, or trading advice. You are solely responsible for your trading decisions.</p>
          <p><strong className="text-white">6. Technology Risk.</strong> Automated systems depend on internet connectivity, third-party infrastructure, and broker API availability. Outages, latency, or errors may result in missed, delayed, or duplicated trades.</p>
          <p><strong className="text-white">7. No Guarantee.</strong> KingBot makes no representation or warranty, express or implied, regarding the future performance of any account, strategy, or trade.</p>
        </div>
      </main>
    </div>
  );
}
