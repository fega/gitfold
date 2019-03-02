const shell = require('shelljs')
const { renderTemplateFile } = require('template-file')
const { promisify } = require('util')
const defaults = require('./defaultRepos')
const glob = promisify(require('glob'));
const path = require('path')
const fs = require('fs')
const pLimit = require('p-limit')(64);
var recursive = require("recursive-readdir");


const writeFile = promisify(fs.writeFile);


module.exports.deleteGit = (folder) => {
  shell.rm('-rf', path.join(folder, '.git'))
}

/**
 * Maybe require
 */
module.exports.maybeQuire = (package) => {
  try {
    const pkg = require(package)
    return pkg
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports.renderTemplates = async (folderPath, data) => {
  const filelist = await recursive(folderPath)
  filelist
    .map(path => ({
      data, file: path, destination: path
    }))
    .map(renderToFile)
  //   .then(fileWriteOperations => Promise.all(fileWriteOperations));
}

module.exports.getDefault = (url) => {
  return defaults[url] || url
}


function renderToFile({ data, file, destination }) {
  return pLimit(() =>
    renderTemplateFile(file, data).then(renderedString =>
      writeFile(destination, renderedString)
    )
  );
}