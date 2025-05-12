/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      zIndex: {
        '60': 60,
        '70': 70,
        '80': 80,
        '90': 90,
        '100': 100
      }
      // colors: {
      //   backgroundPrimary: 'var(--color-primary)',
      //   backgroundSecondary: 'var(--color-secondary)',
      //   backgroundTertiary: 'var(--color-tertiary)',
      //   textPrimary: 'var(--color-on-primary)',
      //   textSecondary: 'var(--color-on-secondary)',
      //   textTertiary: 'var(--color-on-tertiary)',
      // }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

