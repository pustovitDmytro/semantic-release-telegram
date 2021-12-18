import { assert } from 'chai';
import Test, { load } from '../Test';
import { checkError } from '../utils';

const verifyConditions = load('verifyConditions').default;
const factory = new Test();

suite('verifyConditions');

before(function () {
    factory.mockAPI();
});

const options = {
    repositoryUrl : 'http://ag.bb/goref'
};
const branch = { name: 'master' };

test('Positive: valid configuration', async function () {
    const context = {};

    await verifyConditions.call(
        context,
        { chats: [ 9 ] },
        {
            logger : console,
            cwd    : process.cwd(),
            env    : {
                TELEGRAM_BOT_ID    : 'I7ezq',
                TELEGRAM_BOT_TOKEN : 'TiHdAYgZ6xRTv0'
            },
            options,
            branch
        }
    );

    assert.deepOwnInclude(context.verified, {
        'botID'      : 'I7ezq',
        'botToken'   : 'TiHdAYgZ6xRTv0',
        'branch'     : 'master',
        'repository' : {
            url           : options.repositoryUrl,
            protocol      : 'https',
            dropHTTPSAuth : true
        },
        'chats'     : [ 9 ],
        // 'name'      : 'semantic-release-telegram',
        'templates' : {
            'fail'    : 'An <b><i>error</i></b> occured while trying to publish the new version of <b>{name}</b>.\n<pre><code class="language-javascript">{error}</code></pre>',
            'success' : "A <b><i>{release_type}</i></b> version of <a href='{repository_url}'>{name}</a> has been released. Current version is <b>{version}</b>"

        }
    });

    const [ apiCall ] = await factory.getApiCalls('type=requestSent&url=getChat');

    assert.deepEqual(apiCall.data, { 'chat_id': 9 });
});

test('Positive: assets', async function () {
    const context = {};
    const assets = [
        { path: 'CHANGELOG.md' },
        { glob: [ 'reports/**' ], name: 'reports.zip' }
    ];

    await verifyConditions.call(
        context,
        { chats: [ 9 ], name: 'app', assets },
        {
            logger : console,
            cwd    : process.cwd(),
            env    : {
                TELEGRAM_BOT_ID    : 'avxuD60y',
                TELEGRAM_BOT_TOKEN : 'gmWKbSq7yeq4Z'
            },
            options,
            branch
        }
    );

    assert.deepOwnInclude(context.verified, {
        'botID'      : 'avxuD60y',
        'botToken'   : 'gmWKbSq7yeq4Z',
        'branch'     : 'master',
        'repository' : {
            url           : options.repositoryUrl,
            protocol      : 'https',
            dropHTTPSAuth : true
        },
        'chats'     : [ 9 ],
        'name'      : 'app',
        'templates' : {
            'fail'    : 'An <b><i>error</i></b> occured while trying to publish the new version of <b>{name}</b>.\n<pre><code class="language-javascript">{error}</code></pre>',
            'success' : "A <b><i>{release_type}</i></b> version of <a href='{repository_url}'>{name}</a> has been released. Current version is <b>{version}</b>"

        },
        assets : [
            assets[0],
            { ...assets[1], rootDir: process.cwd() }
        ]
    });
});


test('Negative: invalid chat', async function () {
    const promise = verifyConditions.call(
        {},
        { chats: [ 'abc' ] },
        {
            logger : console,
            cwd    : process.cwd(),
            env    : {
                TELEGRAM_BOT_ID    : 'I7ezq',
                TELEGRAM_BOT_TOKEN : 'TiHdAYgZ6xRTv0'
            },
            options,
            branch
        }
    );

    await checkError(promise, 'VALIDATION_FAILED', '{"chats":["NOT_INTEGER"]}');
});

test('Negative: inaccesible chat', async function () {
    const promise = verifyConditions.call(
        {},
        { chats: [ '400' ] },
        {
            logger : console,
            cwd    : process.cwd(),
            env    : {
                TELEGRAM_BOT_ID    : 'I7ezq',
                TELEGRAM_BOT_TOKEN : 'TiHdAYgZ6xRTv0'
            },
            options,
            branch
        }
    );

    await checkError(promise, 'API_ERROR', 'Error: Request failed with status code 400 {"ok":false,"error_code":400,"description":"Bad Request: chat not found"}');
});


test('Positive: telegra.ph', async function () {
    const telegraph = {
        title   : '{name} v.{version}',
        message : '<a href=\'{telegraph_url}\'>Release Notes</a>',
        content : '{release_notes}'
    };

    const context = {};

    await verifyConditions.call(
        context,
        { chats: [ 9 ], name: 'app', 'telegra.ph': telegraph },
        {
            logger : console,
            cwd    : process.cwd(),
            env    : {
                TELEGRAM_BOT_ID    : 'avxuD60y',
                TELEGRAM_BOT_TOKEN : 'gmWKbSq7yeq4Z'
            },
            options,
            branch
        }
    );

    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=createAccount'), 1);
    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=getAccountInfo'), 1);

    assert.exists(context.verified['telegra.ph']);
    assert.exists(context.verified['telegra.ph'].token);
});

after(function () {
    factory.unMockAPI();
});
