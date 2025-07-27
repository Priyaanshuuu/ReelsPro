// tailwind.config.ts - Production CSS fix
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ✅ Add safelist to prevent CSS purging
  safelist: [
    'bg-gradient-to-br',
    'from-[#1a1a2e]',
    'via-[#16213e]',
    'to-[#0f3460]',
    'text-white',
    'flex',
    'items-center',
    'justify-center',
    'min-h-screen',
    'rounded-lg',
    'px-4',
    'py-2',
    'bg-indigo-600',
    'hover:bg-indigo-700',
    'transition-colors',
    'w-full',
    'h-screen',
    'overflow-hidden',
    'relative',
    'absolute',
    'inset-0',
    'z-10',
    'shadow-2xl',
    'border',
    'border-white/20',
    'bg-black/30',
    'backdrop-blur-sm',
    'rounded-full',
    'gap-4',
    'flex-col'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;