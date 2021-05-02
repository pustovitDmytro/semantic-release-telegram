import { getNamespace } from 'cls-hooked';
import { _load } from './entry';

const { default: API } = _load('telegram/TelegramAPI');

function axiosResponse(data) {
    return { data };
}

export const traces = [];
const logger = (level, data) => traces.push(data);

class MOCK_API extends API {
    async _axios(opts) {
        if (opts.method === 'POST' && opts.url.match('sendMessage')) {
            return axiosResponse();
        }

        throw new Error('unknown');
    }

    initLogger() {
        this.logger = { log: logger };
    }

    getTraceId() {
        return getNamespace('__TEST__').get('current').id;
    }
}

const methods = Object.getOwnPropertyNames(MOCK_API.prototype).filter(m => m !== 'constructor');
const BACKUP = {};

methods.forEach(methodName => {
    BACKUP[methodName] = API.prototype[methodName];
});

export function mockAPI() {
    methods.forEach(methodName => {
        API.prototype[methodName] = MOCK_API.prototype[methodName];
    });
}


export function unMockAPI() {
    methods.forEach(methodName => {
        API.prototype[methodName] = BACKUP[methodName];
    });
}

