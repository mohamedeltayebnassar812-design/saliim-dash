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
          dark: '#0A1B24',
          surface: '#0E2530',
          card: '#132F3D',
          cardBorder: '#1E4354',
          cyan: '#07C1BE',
          cyanHover: '#05A8A5',
          teal: '#18746F',
          tealDark: '#135E5A',
          mintBg: '#E7F2ED',
          mintSoft: '#D9ECE4',
          creamBg: '#F3F7F5',
          navyText: '#0A1D30',
          gold: '#E5A93C',
          textMuted: '#94A3B8'
        }
      }
    }
  }
};
