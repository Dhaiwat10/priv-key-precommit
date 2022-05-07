import path from 'path';
import fs from 'fs';

const hardIgnoreList = [
  'node_modules',
  'yarn.lock',
  'package-lock.json',
  '.git',
];

export const getAllFiles = (
  dir: string,
  additonalIgnoreList: string[] = []
): string[] => {
  const ignoreList = [...additonalIgnoreList, ...hardIgnoreList];
  const files: string[] = [];
  fs.readdirSync(dir).forEach((file) => {
    const absolute = path.join(dir, file);

    if (ignoreList.includes(absolute)) return;

    if (fs.statSync(absolute).isDirectory()) {
      files.push(...getAllFiles(absolute));
    } else {
      files.push(absolute);
    }
  });
  return files;
};

export interface Token {
  fileName: string;
  content: string;
}

export const getTokensFromFile = (file: string): Token[] => {
  const tokens: Token[] = [];
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line) => {
    const matches = line.match(/\b[a-zA-Z]+\b/g);
    if (matches) {
      matches.forEach((match) =>
        tokens.push({ fileName: file, content: match })
      );
    } else {
      tokens.push({ fileName: file, content: line });
    }
  });
  const filteredTokens = tokens.filter((token) => token.content.length === 64);
  return filteredTokens;
};
