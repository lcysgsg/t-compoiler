const fs = require('fs-extra');
const path = require('path');

const config = require('./config-factory');
const compilerFilePath = config.compilerFilePath;
const outputPath = path.resolve(`${compilerFilePath}/${config.output}`);

const { Log } = require('./utils')

Log.l('\n^=^ compiler combat ready!\n');

// const args = require('minimist')(process.argv.slice(2));
// Log.l(`args         :`, args);

fs.emptyDirSync(outputPath);

const watcher = require('./watcher');