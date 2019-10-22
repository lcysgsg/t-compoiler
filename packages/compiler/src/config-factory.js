const fs = require('fs-extra');
const path = require('path');
const { extend } = require('./utils')

const CONFIG_FILENAME = 't.compiler.json'
const compilerFilePath = path.resolve('./');
const configPath = `${compilerFilePath}/${CONFIG_FILENAME}`;
const configFileExist = fs.existsSync(configPath);

let config = {
  target: 'src',
  output: 'dist',
};
if (configFileExist) {
  const configFile = require(configPath);
  config = extend(config, configFile)
}

const watchPath = path.resolve(`${compilerFilePath}/${config.target}`);
const outputPath = path.resolve(`${compilerFilePath}/${config.output}`);

config.compilerFilePath = compilerFilePath
config.watchPath = watchPath
config.outputPath = outputPath

module.exports = config;