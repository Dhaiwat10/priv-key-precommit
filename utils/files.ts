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

  tokens.forEach((token, idx) => {
    if (token.content.includes('=')) {
      const newTokens = splitEnv(token);
      delete tokens[idx];
      tokens.push(...newTokens);
    }
  });

  tokens.forEach((token, idx) => {
    const newToken = checkForQuotes(token);
    if (newToken.content !== token.content) {
      delete tokens[idx];
      tokens.push(newToken);
    }
  });

  // todo: trim any whitespace from token contents

  const filteredTokens = tokens.filter((token) => token.content.length === 64);
  return filteredTokens;
};

// runs the check for the pattern found in env files eg. FIELD_NAME=VALUE
export const splitEnv: (token: Token) => Token[] = (token) => {
  const split = token.content.split('=');
  return [
    { fileName: token.fileName, content: split[0] },
    { fileName: token.fileName, content: split[1] },
  ];
};

export const checkForQuotes = (token: Token): Token => {
  if (!token.content.includes('"') && !token.content.includes("'")) {
    return token;
  }
  let newContent = '';
  let finalContent;
  if (token.content.includes('"')) {
    newContent = token.content.replace(/"/g, '');
  }
  if (token.content.includes("'")) {
    newContent = token.content.replace(/'/g, '');
  }
  const words = newContent.split(' ');
  words.forEach((word) => {
    if (word.length === 64) {
      finalContent = word;
    }
  });
  if (finalContent) {
    return { fileName: token.fileName, content: finalContent };
  }
  return token;
};

export const getIgnoreListFromGitignore = (): string[] => {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const lines = gitignore.split('\n');
  return lines;
};
