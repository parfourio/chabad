import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        chabad: {
          dark:        '#4a1520',   // wine-dark  — footer, deep accents
          brown:       '#6b2233',   // wine       — headings, buttons, nav
          amber:       '#b8811f',   // gold       — CTAs, decorative highlights
          gold:        '#c9953a',   // gold-mid   — icon accents
          ltgold:      '#f5f0e8',   // off-white  — subtle section backgrounds
          cream:       '#faf8f4',   // cream      — main page background
          'cream-dk':  '#ede8df',   // cream-dark — section alternates
          rust:        '#8c2d3e',   // wine-mid   — hover states
          text:        '#1a0a05',   // body text  — near black
          'text-mid':  '#2e1508',   // secondary text — dark espresso
          'text-muted':'#6b4c35',   // muted text — warm medium brown
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
