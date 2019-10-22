const clc = require("cli-color");

const Log = {
  l (msg, ...args) {
    console.log(msg, ...args)
  },
  error  (msg) {
    console.log(clc.red.bold(msg))
  },
  warn   (msg) {
    console.log(clc.yellow(msg))
  },
  notice (msg) {
    console.log(clc.cyanBright(msg))
  },
}

const extend = function(a,b){
  for (const key in b) {
    a[key] = b[key]
  }
  return a
}

module.exports = {
  Log,
  extend
}