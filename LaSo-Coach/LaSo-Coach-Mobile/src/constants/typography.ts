export const TYPOGRAPHY = {
  fonts: {
    regular: 'System',
    medium: 'System-Medium',
    bold: 'System-Bold',
    light: 'System-Light',
    cursive: 'DM_Serif_Display', // For special headings
  },
  
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
  
  // Predefined text styles
  styles: {
    h1: {
      fontSize: 36,
      fontFamily: 'System-Bold',
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h2: {
      fontSize: 30,
      fontFamily: 'System-Bold',
      lineHeight: 1.25,
      letterSpacing: -0.025,
    },
    h3: {
      fontSize: 24,
      fontFamily: 'System-Bold',
      lineHeight: 1.375,
    },
    h4: {
      fontSize: 20,
      fontFamily: 'System-Medium',
      lineHeight: 1.375,
    },
    h5: {
      fontSize: 18,
      fontFamily: 'System-Medium',
      lineHeight: 1.5,
    },
    h6: {
      fontSize: 16,
      fontFamily: 'System-Medium',
      lineHeight: 1.5,
    },
    body: {
      fontSize: 16,
      fontFamily: 'System',
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 14,
      fontFamily: 'System',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: 12,
      fontFamily: 'System',
      lineHeight: 1.375,
    },
    button: {
      fontSize: 16,
      fontFamily: 'System-Medium',
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },
    buttonSmall: {
      fontSize: 14,
      fontFamily: 'System-Medium',
      lineHeight: 1.25,
      letterSpacing: 0.025,
    },
    label: {
      fontSize: 14,
      fontFamily: 'System-Medium',
      lineHeight: 1.25,
    },
    cursiveHeading: {
      fontSize: 24,
      fontFamily: 'DM_Serif_Display',
      lineHeight: 1.25,
    }
  }
};

export default TYPOGRAPHY; 