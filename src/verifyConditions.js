import path from 'path';
import { success, fail } from './templates';
import { validate } from './utils';
import Telegram from './telegram';

const rules = {
    name      : [ 'string' ],
    botID     : [ 'required', 'string' ],
    botToken  : [ 'required', 'string' ],
    chats     : [ 'required', { 'list_of': 'integer' } ],
    rootDir   : [ 'required', 'string' ],
    templates : [ 'required', { 'nested_object' : {
        success : [ 'string', { default: success } ],
        fail    : [ 'string', { default: fail } ]
    } } ]
};

export default async function verifyConditions(pluginConfig, { logger, cwd, env }) {
    const info = require(path.resolve(cwd, 'package.json'));
    const raw = {
        ...pluginConfig,
        name      : pluginConfig.name || info.name,
        botID     : env.TELEGRAM_BOT_ID,
        botToken  : env.TELEGRAM_BOT_TOKEN,
        chats     : pluginConfig.chats,
        templates : pluginConfig.templates || {},
        rootDir   : cwd
    };

    const data = validate(raw, rules);
    const telegram = new Telegram(data.botID, data.botToken, data.chats);
    const chatTitles = await telegram.test();

    logger.log(`Verified chats: ${chatTitles.join(', ')}`);
    this.verified = data;

    return data;
}

