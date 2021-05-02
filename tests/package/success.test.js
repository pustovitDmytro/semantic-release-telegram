import { assert } from 'chai';
import {  _load } from '../entry';
import Test from '../Test';
import { checkError } from '../utils';

const success = _load('success').default;
const templates = _load('templates');
const factory = new Test();

suite('success');

before(function () {
    factory.mockAPI();
});

test('Default template', async function () {
    const verified = { name: 'test-app', templates, chats: [ 1, 2 ] };
    const options = { repositoryUrl: 'http://bo.sh/amoti' };

    await success.call(
        { verified },
        null,
        { logger: console, nextRelease: { version: '1.0.2' }, options }
    );

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 2);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 1, 2 ]);
    apiCalls.forEach(item => {
        assert.equal(item.data.text, `A new version of <a href='${options.repositoryUrl}'>${verified.name}</a> has been released. Current version is <b>1.0.2</b>`);
    });
});

test('Negative: missing verify', async function () {
    const promise = success.call(
        {},
        { },
        {
            logger : console
        }
    );

    await checkError(promise, 'VERIFICATION_MISSED', 'verifyConditions should be passed to run step [success]');
});

after(function () {
    factory.unMockAPI();
});
