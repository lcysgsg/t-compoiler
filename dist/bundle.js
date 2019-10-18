(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ttCompile = factory());
}(this, function () { 'use strict';

  var version = "0.0.1";

  // src/main.js

  function main () {
    console.log('version change ' + version);
  }

  return main;

}));
