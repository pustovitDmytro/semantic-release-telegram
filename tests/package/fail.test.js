import { assert } from 'chai';
import Test, { load } from '../Test';


const fail = load('fail').default;
const templates = load('templates');
const factory = new Test();

suite('fail');

before(function () {
    factory.mockAPI();
});

const errors = [ new Error('step leather women back material grow relationship') ];
const repository = {
    url           : 'http://bo.sh/amoti',
    protocol      : 'https',
    dropHTTPSAuth : true
};
const verified = { name: 'test-app', templates, chats: [ 5, 3 ], repository };

test('Default template', async function () {
    await fail.call(
        { verified },
        null,
        { logger: console, errors }
    );

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 2);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 5, 3 ]);
    apiCalls.forEach(item => {
        assert.equal(item.data.text, `An <b><i>error</i></b> occured while trying to publish the new version of <b>${verified.name}</b>.\n<pre><code class="language-javascript">Error: step leather women back material grow relationship</code></pre>`);
    });
});

after(function () {
    factory.unMockAPI();
});
