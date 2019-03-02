#!/usr/bin/env node
const program = require('commander');
const main = require('../index');

program
  .command('new <repo>')
  .option('-f, --folder <path>', 'Destination folder')
  .action(function (repo, cmd) {
    main({
      url: repo,
      folder: cmd.folder || 'my-project'
    })
  })


program.parse(process.argv)