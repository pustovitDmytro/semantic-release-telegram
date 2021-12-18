/* eslint-disable security/detect-object-injection */
import { axiosResponse } from './utils';

export default function (opts) {
    if (opts.method === 'POST' && opts.url.match('createPage')) {
        return axiosResponse({
            url   : 'http://telegra.ph/my_page_url',
            title : opts.data.title
        });
    }

    if (opts.method === 'GET' && opts.url.match('createAccount')) {
        return axiosResponse({
            'short_name'   : opts.params.short_name,
            'access_token' : 'abc_abc'
        });
    }

    if (opts.method === 'GET' && opts.url.match('getAccountInfo')) {
        return axiosResponse({
            'short_name' : 'My_created_account'
        });
    }

    throw new Error(`unknown telegra.ph method: ${JSON.stringify(opts)}`);
}
