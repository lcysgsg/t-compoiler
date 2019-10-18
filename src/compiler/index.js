const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');

// const sourceCode = fs.readFileSync('./ast-parse5/index.html', 'utf-8');

const args = require('minimist')(process.argv.slice(2));
console.log('^=^ \ncompiler/index');
console.log(args);

const compilerFilePath = path.resolve('./');
const config = require(`${compilerFilePath}/t.compiler.json`);
const watchPath = path.resolve(`${compilerFilePath}/${config.target}`);
const outputPath = path.resolve(`${compilerFilePath}/${config.output}`);

console.log(`watchPath: ${watchPath}`)
console.log(`outputPath: ${outputPath}`)

const chokidar = require('chokidar');
chokidar.watch(watchPath).on('all', (event, ckdPath) => {
  console.log(event);
  console.log('ckdPath: ', ckdPath)
  const relativeFilePath = ckdPath.replace(compilerFilePath, '.');
  const outputPathFile = path.resolve(`${outputPath}/${relativeFilePath}`);
  console.log(`relativeFilePath: ${relativeFilePath}`)
  console.log(`outputPathFile: ${outputPathFile}`)
  process.exit(1);
  return 
  const sourceCode = fs.readFileSync(ckdPath, 'utf-8');

  fs.open(outputPath, 'a+', function(err, fd){
    if (err) console.error('open error', err);
    fs.writeFile(outputPathFile, sourceCode);
  });
});
