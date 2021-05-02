/* eslint-disable no-sync */
import path from 'path';
import fs from 'fs-extra';

const templatesDir = path.join(__dirname, '..', 'templates');
const success = fs.readFileSync(path.join(templatesDir, 'SUCCESS.html')).toString();
const fail    = fs.readFileSync(path.join(templatesDir, 'FAIL.html')).toString();

export { success, fail };
