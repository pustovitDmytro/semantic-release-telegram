import path from 'path';
import { success, fail } from './templates';
import { validate } from './utils';
import Telegram from './telegram';

const rules = {
    name       : [ 'string' ],
    branch     : [ 'required', 'string' ],
    repository : [ 'required', { 'nested_object' : {
        url           : [ 'required', 'string' ],
        protocol      : [ { 'one_of': [ 'ssh', 'https' ] }, { default: 'https' } ],
        dropHTTPSAuth : [ 'boolean', { default: true } ]
    } } ],
    botID     : [ 'required', 'string' ],
    botToken  : [ 'required', 'string' ],
    chats     : [ 'required', { 'list_of': 'integer' } ],
    rootDir   : [ 'required', 'string' ],
    templates : [ 'required', { 'nested_object' : {
        success : [ 'string', { default: success } ],
        fail    : [ 'string', { default: fail } ]
    } } ]
};

export default async function verifyConditions(pluginConfig, { logger, cwd, env, options, branch }) {
    // eslint-disable-next-line security/detect-non-literal-require
    const info = require(path.resolve(cwd, 'package.json'));
    const raw = {
        ...options,
        ...pluginConfig,
        botID      : env.TELEGRAM_BOT_ID,
        botToken   : env.TELEGRAM_BOT_TOKEN,
        rootDir    : cwd,
        branch     : branch.name,
        repository : {
            url : options.repositoryUrl,
            ...pluginConfig.repository
        },
        templates : pluginConfig.templates || {},
        name      : pluginConfig.name || info.name
    };

    const data = validate(raw, rules);
    const telegram = new Telegram(data.botID, data.botToken, data.chats);
    const chatTitles = await telegram.test();

    logger.log(`Verified chats: ${chatTitles.join(', ')}`);
    this.verified = data;

    return data;
}

