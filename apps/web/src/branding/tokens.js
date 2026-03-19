/**
 * Keertanalu Design Tokens — JS/TS version
 * For use in styled-components, Tailwind config, or inline styles
 */

export const colors = {
  // Brand core
  ink:          '#1A1208',
  inkSoft:      '#3A2E18',
  gold:         '#B8860B',
  goldLight:    '#D4A92A',
  goldPale:     '#F5E6B8',
  goldFaint:    '#FDF8EC',
  crimson:      '#7B1E2E',
  crimsonLt:    '#A63248',
  crimsonPale:  '#F5E0E4',

  light: {
    bg:          '#FAF7F0',
    surface:     '#FFFFFF',
    surface2:    '#F0EBE0',
    border:      '#E0D8C8',
    borderSoft:  '#EDE7DC',
    text1:       '#1A1208',
    text2:       '#5A4E38',
    text3:       '#8C8070',
    text4:       '#BEB4A8',
    gold:        '#B8860B',
    crimson:     '#7B1E2E',
  },

  dark: {
    bg:          '#0E0A04',
    surface:     '#1C1508',
    surface2:    '#251C0A',
    border:      '#3A2E18',
    borderSoft:  '#2A2010',
    text1:       '#F5E6B8',
    text2:       '#C4A86A',
    text3:       '#8C7850',
    text4:       '#5A4E38',
    gold:        '#D4A92A',
    crimson:     '#A63248',
  },
}

export const fonts = {
  display: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  body:    "'DM Sans', system-ui, -apple-system, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
}

export const radii = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
}

export const spacing = {
  1: '4px',  2: '8px',  3: '12px', 4: '16px',
  5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
}

/** Tailwind v3 theme extension — paste into tailwind.config.js */
export const tailwindExtend = {
  colors: {
    k: {
      ink:     '#1A1208',
      gold:    '#B8860B',
      'gold-light': '#D4A92A',
      'gold-pale':  '#F5E6B8',
      crimson: '#7B1E2E',
      'crimson-lt': '#A63248',
      ivory:   '#FAF7F0',
      night:   '#0E0A04',
      stone:   '#8C8070',
    },
  },
  fontFamily: {
    display: ["'Cormorant Garamond'", 'Georgia', 'serif'],
    sans:    ["'DM Sans'", 'system-ui', 'sans-serif'],
  },
  borderRadius: {
    'k-sm': '8px',
    'k-md': '12px',
    'k-lg': '16px',
    'k-xl': '24px',
  },
}
