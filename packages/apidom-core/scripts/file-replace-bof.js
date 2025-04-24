import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const cwd = process.cwd();
const [, , fileName] = process.argv;
const filePath = path.join(cwd, fileName);
const fileContent = fs.readFileSync(filePath).toString();
const lines = fileContent.split('\n');

lines.unshift('/// <reference path="./minim.d.ts" />\nimport * as minim from "minim";');


const newFileContent = lines.join('\n');
fs.writeFileSync(fileName, newFileContent);
