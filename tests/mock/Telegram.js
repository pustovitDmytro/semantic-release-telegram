/* eslint-disable security/detect-object-injection */
import { axiosResponse, axiosError } from './utils';

export default function (opts) {
    if (opts.method === 'POST' && opts.url.match('sendMessage')) {
        return axiosResponse();
    }

    if (opts.url.match('getChat')) {
        if (opts.data.chat_id === 400) {
            throw axiosError('Request failed with status code 400', { 'ok': false, 'error_code': 400, 'description': 'Bad Request: chat not found' });
        }

        return axiosResponse({ username: 'thick' });
    }

    if (opts.url.match('sendDocument')) {
        return axiosResponse();
    }

    throw new Error('unknown telegram method');
}
