import fse from 'fs-extra';
import { tmpFolder } from './constants';
import { mockAPI, unMockAPI } from  './mock';
import './init';

export default class Test {
    async setTmpFolder() {
        await fse.ensureDir(tmpFolder);
    }
    async cleanTmpFolder() {
        await fse.remove(tmpFolder);
    }

    mockAPI = mockAPI
    unMockAPI = unMockAPI
}

export {
    tmpFolder
};
