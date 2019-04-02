module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': 'error',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'indent': ['error', 4],
    "quotes": 0,
    'eqeqeq': 0 // 必须使用全等
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}1
