module.exports = {
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // General JavaScript rules
    'no-console': 'off', // Allow console.log in server
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'error',
    'no-undef': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': 'error',
    'curly': 'error',
    'brace-style': ['error', '1tbs'],
    'comma-dangle': ['error', 'never'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'never'],
    'indent': ['error', 2],
    'no-trailing-spaces': 'error',
    'eol-last': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never']
  }
}
