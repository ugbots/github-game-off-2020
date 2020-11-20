const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    colors: {
      blue: colors.blue,
      fuchsia: colors.fuchsia,
      gray: colors.coolGray,
      green: colors.emerald,
      orange: colors.orange,
      purple: colors.purple,
      red: colors.red,
      truegray: colors.trueGray,
      yellow: colors.yellow,
    },
    cursor: {
      'context-menu': 'context-menu',
      pointer: 'pointer',
      'not-allowed': 'not-allowed',
    },
    boxShadow: {
      lg: '0 12px 16px 0 rgba(0,0,0,.4)',
    },
    scale: {
      '50': '.5',
      '75': '.75',
      '150': '1.5',
      '200': '2',
      '300': '3',
    },
    fontFamily: {
      mono: ['monospace'],
    },
  },
};
