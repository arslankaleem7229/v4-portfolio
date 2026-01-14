import { css } from 'styled-components';

const fontPath = (family, file) => `/fonts/${family}/${file}`;

const calibreNormalWeights = {
  400: [fontPath('Calibre', 'Calibre-Regular.woff'), fontPath('Calibre', 'Calibre-Regular.woff2')],
  500: [fontPath('Calibre', 'Calibre-Medium.woff'), fontPath('Calibre', 'Calibre-Medium.woff2')],
  600: [fontPath('Calibre', 'Calibre-Semibold.woff'), fontPath('Calibre', 'Calibre-Semibold.woff2')],
};

const calibreItalicWeights = {
  400: [
    fontPath('Calibre', 'Calibre-RegularItalic.woff'),
    fontPath('Calibre', 'Calibre-RegularItalic.woff2'),
  ],
  500: [
    fontPath('Calibre', 'Calibre-MediumItalic.woff'),
    fontPath('Calibre', 'Calibre-MediumItalic.woff2'),
  ],
  600: [
    fontPath('Calibre', 'Calibre-SemiboldItalic.woff'),
    fontPath('Calibre', 'Calibre-SemiboldItalic.woff2'),
  ],
};

const sfMonoNormalWeights = {
  400: [fontPath('SFMono', 'SFMono-Regular.woff'), fontPath('SFMono', 'SFMono-Regular.woff2')],
  600: [fontPath('SFMono', 'SFMono-Semibold.woff'), fontPath('SFMono', 'SFMono-Semibold.woff2')],
};

const sfMonoItalicWeights = {
  400: [
    fontPath('SFMono', 'SFMono-RegularItalic.woff'),
    fontPath('SFMono', 'SFMono-RegularItalic.woff2'),
  ],
  600: [
    fontPath('SFMono', 'SFMono-SemiboldItalic.woff'),
    fontPath('SFMono', 'SFMono-SemiboldItalic.woff2'),
  ],
};

const calibre = {
  name: 'Calibre',
  normal: calibreNormalWeights,
  italic: calibreItalicWeights,
};

const sfMono = {
  name: 'SF Mono',
  normal: sfMonoNormalWeights,
  italic: sfMonoItalicWeights,
};

const createFontFaces = (family, style = 'normal') => {
  let styles = '';

  for (const [weight, formats] of Object.entries(family[style])) {
    const woff = formats[0];
    const woff2 = formats[1];

    styles += `
      @font-face {
        font-family: '${family.name}';
        src: url(${woff2}) format('woff2'),
            url(${woff}) format('woff');
        font-weight: ${weight};
        font-style: ${style};
        font-display: auto;
      }
    `;
  }

  return styles;
};

const calibreNormal = createFontFaces(calibre);
const calibreItalic = createFontFaces(calibre, 'italic');

const sfMonoNormal = createFontFaces(sfMono);
const sfMonoItalic = createFontFaces(sfMono, 'italic');

const Fonts = css`
  ${calibreNormal + calibreItalic + sfMonoNormal + sfMonoItalic}
`;

export default Fonts;
