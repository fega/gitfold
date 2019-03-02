const shell = require('shelljs');
const inquirer = require('inquirer');
const { maybeQuire, getDefault, renderTemplates, deleteGit } = require('./util')
const path = require('path')

module.exports = async (config) => {
  /**
   * CLONE REPO
   */
  const _url = getDefault(config.url)
  console.log(`Cloning ${_url}`)
  const child = shell.exec(`git clone ${_url} ${config.folder}`);
  console.log(`Cloned ${_url}`)

  /**
   * GET FILES
   */
  const filePath = path.join(process.cwd(), `${config.folder}/gitfold`);
  const folderPath = path.join(process.cwd(), `${config.folder}`);
  const gitfoldFile = maybeQuire(filePath);
  deleteGit(folderPath)
  if (!gitfoldFile) { console.log('gitfold.js file not found or is invalid'); return null }

  /**
   * Options
   */
  const { questions, process: exec, options } = gitfoldFile
  if (!questions) { console.log('No questions found') }
  const answers = questions ? await inquirer.prompt(questions) : {}
  const result = exec ? await exec(answers) : answers

  /**
   * render
   */
  await renderTemplates(folderPath, result)

}