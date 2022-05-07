#!/usr/bin/env node

import { checkIfPrivKey } from './utils/crypto';
import { getAllFiles, getTokensFromFile, Token } from './utils/files';

const run = () => {
  const files = getAllFiles('./', [
    'dist',
    'package.json',
    'index.ts',
    'utils',
    'readme.md',
    'tsconfig.json',
  ]);
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
    console.log(`Found ${vulnFiles.length} files containing private keys`);
    console.log(vulnFiles);
    throw Error();
  }
};

run();
