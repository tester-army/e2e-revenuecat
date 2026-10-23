import { StyleSheet } from 'react-native';

// The e2e landing's tokens, from e2e-stripe's styles/e2e.css: a dark canvas, hairlines instead of shadows, square corners.
export const colors = {
  canvas: '#111111',
  panel: '#161616',
  hairlineStrong: 'rgba(255, 255, 255, 0.2)',
  textBright: '#ffffff',
  textPrimary: '#f9f8f7',
  textSoft: 'rgba(255, 255, 255, 0.9)',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textFaint: 'rgba(255, 255, 255, 0.5)',
  buttonFill: '#f9f8f7',
  textOnLight: '#161616',
  accentOrange: '#ff8001',
};

// Family names as the font files declare them; the expo-font plugin in app.json embeds the files.
export const fonts = {
  display: 'Stack Sans Notch',
  sans: 'Inter',
  mono: 'DM Mono',
};

export const type = StyleSheet.create({
  h1: { fontFamily: fonts.display, fontSize: 38, lineHeight: 43 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 24 },
  bodyS: { fontFamily: fonts.sans, fontSize: 14, lineHeight: 24 },
  caption: { fontFamily: fonts.sans, fontSize: 12, lineHeight: 16 },
  codeS: { fontFamily: fonts.mono, fontSize: 13.5, lineHeight: 23 },
  labelXs: { fontFamily: fonts.mono, fontSize: 11, lineHeight: 16, letterSpacing: 1.1, textTransform: 'uppercase' },
  buttonS: { fontFamily: fonts.mono, fontSize: 13, lineHeight: 20, fontWeight: '500', textTransform: 'uppercase' },
  nav: { fontFamily: fonts.mono, fontSize: 16, lineHeight: 24, textTransform: 'uppercase' },
  brand: { fontFamily: fonts.display, fontSize: 26, lineHeight: 30, letterSpacing: -1.56 },
  brandSlash: { fontFamily: fonts.mono, fontSize: 26, lineHeight: 30, letterSpacing: -1.56 },
});
