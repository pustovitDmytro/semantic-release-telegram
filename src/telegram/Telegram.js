
import { fill } from 'myrmidon';
import Api from './TelegramAPI';

function dumpChat(chat) {
    return chat.title || chat.username;
}

export default class Heroku {
    constructor(botId, dotToken, chats) {
        this.api = new Api(botId, dotToken);
        this.chats = chats;
    }

    async send(template, variables, files = []) {
        const html = fill(template, variables);
        const promises = this.chats.map(async chat => {
            await this.api.sendMessage(chat, html);
            await Promise.all(files.map(async filePath => {
                await this.api.sendFile(chat, filePath);
            }));
        });

        await Promise.all(promises);
    }

    async test() {
        const chats = await Promise.all(this.chats.map(chat => this.api.test(chat)));

        return chats.map(dumpChat);
    }
}
