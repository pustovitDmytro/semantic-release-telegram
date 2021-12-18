/* eslint-disable unicorn/filename-case */
import BaseAPI from 'base-api-client';
import FormData from 'form-data';

export default class TelegramAPI extends BaseAPI {
    constructor(id, token) {
        super(`https://api.telegram.org/bot${id}:${token}`);
    }

    onResponse(res) {
        return res.data.result;
    }

    sendMessage(chatId, html, preview = false) {
        return this.post('sendMessage', {
            'parse_mode'               : 'HTML',
            'text'                     : html,
            'chat_id'                  : chatId,
            'disable_web_page_preview' : !preview
        });
    }

    sendFile(chatId, stream) {
        const form = new FormData();

        form.append('document', stream,  { filepath: stream.path });
        form.append('chat_id', chatId);

        return this.post('sendDocument', form, {
            headers      : form.getHeaders(),
            responseType : 'stream'
        });
    }

    test(chatId) {
        return this.post('getChat', {
            'chat_id' : chatId
        });
    }
}
