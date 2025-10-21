/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Jido 테마 색상
        'jido-bg': '#0a0e1a',
        'jido-panel': '#111623',
        'jido-muted': '#1B2333',
        'jido-accent': '#50E3C2',
        'jido-text': '#eaf6ff',
        'jido-sub': '#8b9dc3',
      },
      fontFamily: {
        'mono': ['Fira Code', 'Noto Sans KR', 'monospace'],
      },
    },
  },
  plugins: [],
}
