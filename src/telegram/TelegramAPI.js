import BaseAPi from 'base-api-client';

export default class TelegramAPI extends BaseAPi {
    constructor(id, token) {
        super(`https://api.telegram.org/bot${id}:${token}`);
    }

    onResponse(res) {
        return res.data.result;
    }

    sendMessage(chatId, html) {
        return this.post('sendMessage', {
            'parse_mode'               : 'HTML',
            'text'                     : html,
            'chat_id'                  : chatId,
            'disable_web_page_preview' : true
        });
    }

    sendFile(chatId, fileId) {
        return this.post('sendDocument', {
            'document' : fileId,
            'chat_id'  : chatId
        });
    }

    test(chatId) {
        return this.post('getChat', {
            'chat_id' : chatId
        });
    }
}
