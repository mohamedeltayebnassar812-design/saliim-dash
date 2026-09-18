/**
 * Saliim Platform - Unified Tailwind CSS Configuration
 * Dr. Ahmed Elkhateeb (Saliim)
 */
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', 'Cairo', 'sans-serif'],
        ar: ['Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
        en: ['Plus Jakarta Sans', 'sans-serif']
      },
      colors: {
        brand: {
          dark: '#071626',
          surface: '#0B1E33',
          card: '#102A45',
          cardBorder: '#19436B',
          cyan: '#1D9BF0',
          cyanHover: '#1A8CD8',
          teal: '#0A4174',
          tealDark: '#07335C',
          mintBg: '#EAF2F8',
          mintSoft: '#DCE9F5',
          creamBg: '#F2F7FA',
          navyText: '#0A1D30',
          gold: '#E5A93C',
          textMuted: '#94A3B8'
        }
      }
    }
  }
};
