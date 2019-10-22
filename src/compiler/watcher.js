const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('mkdirp');
const chokidar = require('chokidar');
const { Log } = require('./utils')

const config = require('./config-factory');
const compilerFilePath = config.compilerFilePath;
const watchPath = path.resolve(`${compilerFilePath}/${config.target}`);
const outputPath = path.resolve(`${compilerFilePath}/${config.output}`);

Log.l(`config :`, config);
Log.notice(`# watching ${watchPath} -> ${outputPath} ...`)

// 路径中的文件名
// e.g. `./src/index.html => index.html`
const filenameReg = /[^\\/]+\.(html|htm)$/;

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
    const sourceCode = fs.readFileSync(ckdPath, 'utf-8');
    this._writeFile(sourceCode, outputFileAbsolutePath);
  },

  change(ckdPath) {
    const { outputFileAbsolutePath } = getUsualPath(ckdPath);
    const stat = fs.statSync(ckdPath);
    if (stat.isFile()) {
      const sourceCode = fs.readFileSync(ckdPath, 'utf-8');
      this._writeFile(sourceCode, outputFileAbsolutePath);
    }
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

  _writeFile(sourceCode, filePath) {
    fs.open(outputPath, 'a+', function(err, fd) {
      if (err) console.error('open error', err);
      fs.writeFile(filePath, sourceCode);
    });
  },
};

function getUsualPath(ckdPath) {
  // 发生变动文件的相对路径
  // e.g. .\index.html
  const fileRelativePath = ckdPath
    .replace(`${compilerFilePath}`, '.')
    .replace('\\src', '');
  // 要输出的文件的绝对路径
  // e.g. ${root}\dist\index.html
  const outputFileAbsolutePath = path.resolve(
    `${outputPath}/${fileRelativePath}`,
  );
  // 要输出的文件夹的相对路径
  // e.g. .\dist\add-dir\
  const outputDirRelativePath = outputFileAbsolutePath
    .replace(compilerFilePath, '.')
    .replace(filenameReg, '');
  console.log(`fileRelativePath       : ${fileRelativePath}`);
  console.log(`outputFileAbsolutePath : ${outputFileAbsolutePath}`);
  console.log(`outputDirRelativePath  : ${outputDirRelativePath}`);

  return {
    fileRelativePath,
    outputFileAbsolutePath,
    outputDirRelativePath,
  };
}
