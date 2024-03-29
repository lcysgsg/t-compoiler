const parse5 = require('parse5');
const { Log } = require('../utils')

Log.notice('# parse begin');

// TODO： parse5 的适配器
// TODO： 找到标记做转换
function matchNode (elem) {
  
  if (elem.nodeName === 'ys-table') {
    console.log('find ys-table !');
    // elem.nodeName = 'table';
    // parseTable(elem);
  }
  if (elem.nodeName === 'ys-list') {
    elem.nodeName = 'div'
    elem.tagName = 'div'
    elem.attrs.push({name: 'data-v-ys-list', value: ''})
  }
  if (elem.nodeName === 'ys-form') {
    elem.nodeName = 'form'
    elem.tagName = 'form'
    elem.attrs.push({name: 'data-v-ys-form', value: ''})
  }
  if (elem.nodeName === 'ys-tr') {
    elem.nodeName = 'tr'
    elem.tagName = 'tr'
    elem.attrs.push({name: 'data-v-ys-tr', value: ''})
  }
  if (elem.nodeName === 'ys-td') {
    elem.nodeName = 'td'
    elem.tagName = 'td'
    elem.attrs.push({name: 'data-v-ys-td', value: ''})
  }
  if (elem.nodeName === 'ys-input') {
    elem.nodeName = 'input'
    elem.tagName = 'input'
    elem.attrs.push({name: 'data-v-ys-input', value: ''})
  }
}


// 1. 传html源码进来解析
// 2. 递归找标记
// 3. 加载对应库
// 4. 输出结果
function parse(htmlSourceCode) {
  const document = parse5.parse(htmlSourceCode);

  function recusionChildNodes(elem) {
    for (const key in elem) {
      if (elem.hasOwnProperty(key)) {
        if (key === 'childNodes') {
          elem[key].map(e => {

            matchNode(e);

            if (e.childNodes) {
              recusionChildNodes(e);
            }
          });
        }
      }
    }
  }

  recusionChildNodes(document);
  const html = parse5.serialize(document);
  return html;
}

exports.parse = parse
