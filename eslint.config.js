// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    typescript: true,
    typescript: {
      overrides: {
        'ts/consistent-type-imports': 'off',
      },
    },
  },
)
