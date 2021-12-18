/* eslint-disable unicorn/filename-case */
import BaseAPI from 'base-api-client';

export default class TelegraphAPI extends BaseAPI {
    constructor(token) {
        super('https://api.telegra.ph');
        this.token = token;
    }

    onResponse(res) {
        return res.data.result;
    }

    setToken(token) {
        this.token = token;
    }

    _axios(opts) {
        // eslint-disable-next-line no-param-reassign
        if (opts.method === 'GET') delete opts.data;

        return super._axios(opts);
    }

    createAccount(name) {
        return this.get('createAccount', {
            'short_name' : name
        });
    }

    getAccountInfo() {
        return this.get('getAccountInfo', {
            'access_token' : this.token
        });
    }

    createPage(title, content) {
        return this.post('createPage', {
            'access_token' : this.token,
            title,
            content
        });
    }
}
