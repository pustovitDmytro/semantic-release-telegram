import { assert } from 'chai';
import {  _load } from '../entry';
import Test from '../Test';
import { checkError } from '../utils';

const verifyConditions = _load('verifyConditions').default;
const factory = new Test();

suite('verifyConditions');

before(function () {
    factory.mockAPI();
});

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
            }
        }
    );

    assert.deepOwnInclude(context.verified, {
        'botID'     : 'I7ezq',
        'botToken'  : 'TiHdAYgZ6xRTv0',
        'chats'     : [ 9 ],
        'name'      : 'semantic-release-telegram',
        'templates' : {
            'fail'    : 'An error occured while trying to publish the new version of <b>{name}</b>.\n<pre><code class="language-javascript">{error}</code></pre>',
            'success' : "A new version of <a href='{repository_url}'>{name}</a> has been released. Current version is <b>{version}</b>"
        }
    });

    const [ apiCall ] = await factory.getApiCalls('type=requestSent&url=getChat');

    assert.deepEqual(apiCall.data, { 'chat_id': 9 });
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
            }
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
            }
        }
    );

    await checkError(promise, 'API_ERROR', 'Error: Request failed with status code 400 {"ok":false,"error_code":400,"description":"Bad Request: chat not found"}');
});

after(function () {
    factory.unMockAPI();
});
