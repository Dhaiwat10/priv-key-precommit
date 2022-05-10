#!/usr/bin/env node

import { checkIfPrivKey } from './utils/crypto';
import {
  getAllFiles,
  getIgnoreListFromGitignore,
  getTokensFromFile,
  Token,
} from './utils/files';
import chalk from 'chalk';

const run = () => {
  const ignoreList = getIgnoreListFromGitignore();
  const files = getAllFiles('./', [...ignoreList]);
  const tokens: Token[] = [];
  files.forEach((file) => {
    tokens.push(...getTokensFromFile(file));
  });
  const vulnFiles: string[] = [];
  tokens.forEach((token) => {
    if (checkIfPrivKey(token.content)) {
      vulnFiles.push(token.fileName);
    }
  });
  if (vulnFiles.length > 0) {
    console.log(
      chalk.red(
        `🚨 Found ${vulnFiles.length} instance(s) of private keys. Aborting commit.`
      )
    );
    vulnFiles.forEach((file) => console.log(chalk(`=> ${file}`)));
    process.exit(1);
  } else {
    console.log(chalk.green('✅ No private keys found'));
  }
};

run();
