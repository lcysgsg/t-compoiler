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

const uuidv4 = function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  Log,
  extend,
  uuidv4
}