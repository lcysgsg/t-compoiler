const execa = require('execa')

execa(
  'rollup',
  [
    '-wc',
    '--environment',
    []
  ],
  {
    stdio: 'inherit'
  }
)
