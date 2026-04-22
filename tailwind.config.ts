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
          dark:    '#1C0800',
          brown:   '#3D1A00',
          amber:   '#C87020',
          gold:    '#D4A017',
          ltgold:  '#E8C878',
          cream:   '#F5E8C8',
          rust:    '#8B3800',
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
