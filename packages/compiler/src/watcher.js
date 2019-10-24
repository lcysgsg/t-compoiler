const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const chokidar = require('chokidar');
const { Log } = require('./utils');
const transform = require('./transform/index');

const config = require('./config-factory');
const compilerFilePath = config.compilerFilePath;
const watchPath = path.resolve(`${compilerFilePath}/${config.target}`);
const outputPath = path.resolve(`${compilerFilePath}/${config.output}`);

Log.notice(`# watching ${watchPath} -> ${outputPath} ...`)

// 路径中的文件名
// e.g. `./src/index.html => index.html`
const filenameReg = /[^\\/]+\..+$/;

// 监听
const watcher = chokidar.watch(watchPath, {});
const watcherLog = function(event, ckdPath) {
  if (event === 'error') {
    Log.error(`\n\t# ${event} ===> ${ckdPath}`)
  } else {
    Log.l(`\n\t# ${event} ===> ${ckdPath}`);
  }
};

// 监听文件（夹）变动并更新到 outputPath 中
watcher
  .on('add', ckdPath => {
    watcherLog('add', ckdPath);
    watcherEventHandler.add(ckdPath);
  })
  .on('change', ckdPath => {
    watcherLog('change', ckdPath);
    watcherEventHandler.change(ckdPath);
  })
  .on('unlink', ckdPath => {
    watcherLog('unlink', ckdPath);
  });

// More possible events.
watcher
  .on('addDir', ckdPath => {
    watcherLog('addDir', ckdPath);
    watcherEventHandler.addDir(ckdPath);
  })
  .on('unlinkDir', path => watcherLog('unlinkDir', path))
  .on('error', error => {
    // 删除一个空文件夹会报错： Error: EPERM: operation not permitted, watch
    // 像是与 windows 平台的bug， 暂时不显示它
    // https://github.com/paulmillr/chokidar/issues/566
    if (error.code === 'EPERM' && require('os').platform() === 'win32') return 
    watcherLog('error', error)
  });
// .on('ready', () => watcherLog('ready', path))
// .on('raw', (event, path, details) => { // internal
//   watcherLog('Raw event info:', event, path, details);
// });

const watcherEventHandler = {
  add(ckdPath) {
    const { outputFileAbsolutePath } = getUsualPath(ckdPath);
    const filename = ckdPath.match(filenameReg);
    const sourceCode = fs.readFileSync(ckdPath, 'utf-8');
    const translated = this._translate(filename, sourceCode);
    this._writeFile(translated, outputFileAbsolutePath);
  },

  // 目前 change 跟 add 事件情况基本相同， 都是解析、转换、写入
  change(ckdPath) {
    // const stat = fs.statSync(ckdPath);
    // if (stat.isFile()) {
    this.add(ckdPath)
    // }
  },

  addDir(ckdPath) {
    const { outputFileAbsolutePath, outputDirRelativePath } = getUsualPath(ckdPath);
    const isFileExist = fs.existsSync(outputFileAbsolutePath);
    if (!isFileExist) {
      mkdirp(outputDirRelativePath, function(err) {
        if (err) console.error(err);
        // else console.log('pow!');
      });
    }
  },

  _translate(filename, code){
    const parseResult = transform.parse(filename, code)
    return parseResult
  },

  _writeFile(code, filePath) {
    fs.open(outputPath, 'a+', function(err, fd) {
      if (err) console.error('open error', err);
      fs.writeFile(filePath, code);
    });
  },
};

/**
 * 根据被修改文件路径得出
 * @param ckdPath string 
 * @returns object {
 *  fileRelativePath, 发生变动文件的相对路径 e.g. .\index.html
 *  outputFileAbsolutePath, 要输出的文件的绝对路径 e.g. ${root}\dist\index.html
 *  outputDirRelativePath, 要输出的文件夹的相对路径 e.g. .\dist\add-dir\
 *}
 */
function getUsualPath(ckdPath) {
  const fileRelativePath = ckdPath
    .replace(`${compilerFilePath}`, '.')
    .replace('\\src', '');
  const outputFileAbsolutePath = path.resolve(
    `${outputPath}/${fileRelativePath}`,
  );
  const outputDirRelativePath = outputFileAbsolutePath
    .replace(compilerFilePath, '.')
    .replace(filenameReg, '');
  // console.log(`fileRelativePath       : ${fileRelativePath}`);
  // console.log(`outputFileAbsolutePath : ${outputFileAbsolutePath}`);
  // console.log(`outputDirRelativePath  : ${outputDirRelativePath}`);

  return {
    fileRelativePath,
    outputFileAbsolutePath,
    outputDirRelativePath,
  };
}
