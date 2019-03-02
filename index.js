const shell = require('shelljs');
const chalk = require('chalk')
const inquirer = require('inquirer');
const { maybeQuire, getDefault, renderTemplates, deleteGit, log } = require('./util')
const path = require('path')

module.exports = async (config) => {
  /**
   * clone repo
   */
  const _url = getDefault(config.url)
  log(`Cloning ${_url}`)
  const child = shell.exec(`git clone ${_url} ${config.folder}`);
  log(`Cloned ${_url}`)

  /**
   * GET FILES
   */
  const filePath = path.join(process.cwd(), `${config.folder}/gitfold`);
  const folderPath = path.join(process.cwd(), `${config.folder}`);
  const gitfoldFile = maybeQuire(filePath);
  deleteGit(folderPath)
  if (!gitfoldFile) { log('gitfold.js file not found or is invalid'); return null }

  /**
   * Options
   */
  const { questions, process: exec, options, end } = gitfoldFile
  if (!questions) { log('No questions found') }
  const answers = questions ? await inquirer.prompt(questions) : {}
  const result = exec ? await exec(answers) : answers

  /**
   * render
   */
  await renderTemplates(folderPath, result)

  /**
   * install
   */
  shell.cd(config.folder)
  log('installing node modules')
  shell.exec('npm install')
  if (end) console.log(end(config, { shell, chalk }))
  log('Finished')
}