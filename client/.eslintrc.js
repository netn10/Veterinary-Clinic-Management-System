module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', '@vue/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    // Vue.js specific rules
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'error',
    'vue/no-multiple-template-root': 'off',

    // General JavaScript rules
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: 'error',
    curly: 'error',
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'never'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    indent: ['error', 2],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
  }
};
