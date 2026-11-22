const UNITE = String.raw`(?<![\w-])-?\d*\.?\d+(px|rem|em|ms|s|vw|vh|vmin|vmax|deg)\b`

export default {
  ignoreFiles: ['design-system/**', 'dist/**', 'storybook-static/**', 'ancien-portfolio/**'],
  overrides: [{ files: ['**/*.astro'], customSyntax: 'postcss-html' }],
  rules: {
    'color-no-hex': true,
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
    ],
    'color-named': 'never',
    'declaration-property-value-disallowed-list': {
      '/.*/': [`/${UNITE}/`],
      opacity: ['/^\\d*\\.\\d+$/'],
      'font-weight': ['/^\\d+$/'],
      'line-height': ['/^[\\d.]+$/'],
    },
  },
}
