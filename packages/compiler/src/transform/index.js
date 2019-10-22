const htmlParse = require('./html').parse;

const isHtml = (filename) => /\.html?$/.test(filename)

function parse (filename, sourceCode){
  let result = sourceCode;
  if (isHtml(filename)) {
    result = htmlParse(sourceCode)
  }

  return result;
}

exports.parse = parse