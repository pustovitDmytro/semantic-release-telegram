/* eslint-disable security/detect-non-literal-require */
import { entry } from './constants';

const m = require(entry);

const { verifyConditions, success, fail } = m;

export { verifyConditions, success, fail };
