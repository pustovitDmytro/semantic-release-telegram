import { getNamespace } from 'cls-hooked';
import { load } from '../utils';

import telegramMock from './Telegram';
import telegraphMock from './Telegraph';

const { default: TelegramAPI } = load('telegram/TelegramAPI');
const { default: TelegraphAPI } = load('telegram/TelegraphAPI');

export const traces = [];

const defaultMethods = {
    log(level, data) {
        traces.push(data);
    },

    getTraceId() {
        return getNamespace('__TEST__').get('current').id;
    }
};

const APIs = [
    {
        API     : TelegramAPI,
        methods : { ...defaultMethods, _axios: telegramMock }
    },
    {
        API     : TelegraphAPI,
        methods : { ...defaultMethods, _axios: telegraphMock }
    }
];

for (const api of APIs) {
    api.BACKUP = {};
    Object.keys(api.methods).forEach(methodName => {
        api.BACKUP[methodName] = api.API.prototype[methodName];
    });
}

export function mockAPI() {
    for (const api of APIs) {
        for (const methodName of Object.keys(api.methods)) {
            api.API.prototype[methodName] = api.methods[methodName];
        }
    }
}

export function unMockAPI() {
    for (const api of APIs) {
        for (const methodName of Object.keys(api.methods)) {
            api.API.prototype[methodName] = api.BACKUP[methodName];
        }
    }
}
