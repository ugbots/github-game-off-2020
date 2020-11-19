const colors = require('tailwindcss/colors');

module.exports = {
  theme: {
    colors: {
      red: colors.red,
      fuchsia: colors.fuchsia,
      gray: colors.coolGray,
      green: colors.emerald,
      orange: colors.orange,
      purple: colors.purple,
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
    fontFamily: {
      mono: ['monospace'],
    },
  },
};
