
import fs from 'fs';
import { Stream } from 'stream';
import { fill } from 'myrmidon';
import archiver from 'archiver';
import Api from './TelegramAPI';

function dumpChat(chat) {
    return chat.title || chat.username;
}

function getArchiveStream(patterns, root) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const streamPassThrough = new Stream.PassThrough();

    patterns.forEach(item => {
        archive.glob(item, { cwd: root });
    });

    archive.pipe(streamPassThrough);
    archive.finalize();

    return streamPassThrough;
}

export default class Telegram {
    constructor(botId, dotToken, chats) {
        this.api = new Api(botId, dotToken);
        this.chats = chats;
    }

    async send(template, variables, files = []) {
        const html = fill(template, variables);
        const promises = this.chats.map(async chat => {
            await this.api.sendMessage(chat, html);
            await Promise.all(files.map(async file => {
                const stream = file.glob
                    ? getArchiveStream(file.glob, file.rootDir)
                    : fs.createReadStream(file.path);

                if (file.name) stream.path = file.name;

                await this.api.sendFile(chat, stream);
            }));
        });

        await Promise.all(promises);
    }

    async test() {
        const chats = await Promise.all(this.chats.map(chat => this.api.test(chat)));

        return chats.map(dumpChat);
    }
}
