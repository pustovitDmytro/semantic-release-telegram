import path from 'path';
import { success, fail } from './templates';
import { validate } from './utils';
import Telegram, { Telegraph } from './telegram';

const rules = {
    name       : [ 'string' ],
    branch     : [ 'required', 'string' ],
    repository : [ 'required', { 'attributes' : {
        url           : [ 'required', 'string' ],
        protocol      : [ { 'enum': [ 'ssh', 'https' ] }, { default: 'https' } ],
        dropHTTPSAuth : [ 'boolean', { default: true } ]
    } } ],
    botID     : [ 'required', 'string' ],
    botToken  : [ 'required', 'string' ],
    chats     : [ 'required', { 'every': 'integer' } ],
    rootDir   : [ 'required', 'string' ],
    templates : [ 'required', { 'attributes' : {
        success : [ 'string', { default: success } ],
        fail    : [ 'string', { default: fail } ]
    } } ],
    assets : [ { 'every' : { or : [
        { 'attributes' : {
            path : [ 'required', 'string' ],
            name : [ 'string' ]
        } },
        { 'attributes' : {
            glob : [ 'required', { 'every': 'string' }  ],
            name : [ 'required', 'string' ]
        } }
    ] } } ],
    'telegra.ph' : { 'attributes' : {
        title   : [ 'required', 'string' ],
        content : [ 'required', 'string' ],
        message : [ 'required', 'string' ]
    } }
};

export default async function verifyConditions(pluginConfig, { logger, cwd, env, options, branch }) {
    // eslint-disable-next-line security/detect-non-literal-require
    const info = require(path.resolve(cwd, 'package.json'));
    const opts = {
        ...options,
        ...pluginConfig
    };

    const raw = {
        ...opts,
        botID      : env.TELEGRAM_BOT_ID,
        botToken   : env.TELEGRAM_BOT_TOKEN,
        rootDir    : cwd,
        branch     : branch.name,
        repository : {
            url : options.repositoryUrl,
            ...pluginConfig.repository
        },

        assets    : opts.assets || [],
        templates : opts.templates || {},
        name      : opts.name || info.name
    };

    const data = validate(raw, rules);
    const telegram = new Telegram(data.botID, data.botToken, data.chats);
    const chatTitles = await telegram.test();

    logger.log(`Verified chats: ${chatTitles.join(', ')}`);

    if (data['telegra.ph']) {
        const telegraph = new Telegraph();

        const token = await telegraph.authorize();
        const account = await telegraph.test();

        logger.log(`Verified telegra.ph account ${account}`);

        // eslint-disable-next-line require-atomic-updates
        data['telegra.ph'].token = token;
    }

    data.assets = data.assets.map(
        asset => asset.glob
            ? { ...asset, rootDir: data.rootDir }
            : asset
    );
    this.verified = data;

    return data;
}

