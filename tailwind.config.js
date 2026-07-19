/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070C',
        panel: 'rgba(17, 24, 38, 0.72)',
        panel2: 'rgba(22, 31, 46, 0.85)',
        panelSolid: '#0D1420',
        border: 'rgba(56, 189, 248, 0.14)',
        borderStrong: 'rgba(56, 189, 248, 0.35)',
        gold: '#F0B429',
        cyan: '#22D3EE',
        violet: '#8B5CF6',
        gain: '#22C55E',
        loss: '#EF4444',
        muted: '#8B98A9',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(56, 189, 248, 0.15)',
        goldGlow: '0 0 24px rgba(240, 180, 41, 0.18)',
        card: '0 8px 32px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(56,189,248,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.05) 1px, transparent 1px)',
        'radial-glow': 'radial-gradient(circle at top, rgba(139,92,246,0.15), transparent 60%)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
};
