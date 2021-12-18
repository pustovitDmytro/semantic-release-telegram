import path from 'path';
import { assert } from 'chai';
import FormData from 'form-data';
import Test, { load } from '../Test';
import { checkError } from '../utils';

const success = load('success').default;
const templates = load('templates');
const factory = new Test();

suite('success');

before(function () {
    factory.mockAPI();
});

const repository = {
    url           : 'http://bo.sh/amoti',
    protocol      : 'https',
    dropHTTPSAuth : true
};

test('Default template', async function () {
    const verified = { name: 'test-app', templates, chats: [ 1, 2 ], repository };

    await success.call(
        { verified },
        null,
        { logger: console, nextRelease: { version: '1.0.2', type: 'patch' } }
    );

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendMessage');

    assert.lengthOf(apiCalls, 2);
    assert.deepEqual(apiCalls.map(i => i.data.chat_id), [ 1, 2 ]);
    apiCalls.forEach(item => {
        assert.equal(item.data.text, `A <b><i>patch</i></b> version of <a href='https://bo.sh/amoti'>${verified.name}</a> has been released. Current version is <b>1.0.2</b>`);
    });
});

test('Positive: assets', async function () {
    const assets = [
        { path: 'CHANGELOG.md' },
        { glob: [ 'templates/**' ], name: 'templates', rootDir: path.resolve(__dirname, '../../') }
    ];

    const verified = { name: 'test-app', templates, chats: [ 1, 2 ], repository, assets };

    await success.call(
        { verified },
        null,
        { logger: console, nextRelease: { version: '1.0.2', type: 'patch' } }
    );

    const apiCalls = await factory.getApiCalls('type=requestSent&url=sendDocument');

    assert.lengthOf(apiCalls, 2 * 2);

    for (const form of  apiCalls.map(r => r.data)) {
        assert.instanceOf(form, FormData);
    }
});


test('Positive: telegra.ph', async function () {
    const telegraph = {
        title   : '{name} v.{version}',
        message : '<a href=\'{telegraph_url}\'>Release Notes</a>',
        content : '{release_notes}'
    };

    const notes = `
## [1.2.15](https://github.com/pustovitDmytro/semantic-release-telegram/compare/v1.2.14...v1.2.15) (2021-09-09)

### Chore

* fixes audit [devDependencies] ([d08b1fc](https://github.com/pustovitDmytro/semantic-release-telegram/commit/d08b1fc075b7eef59c59f755e1ee96748824e415))

### Upgrade

* Update dependency git-url-parse to v11.6.0 ([0ee4167](https://github.com/pustovitDmytro/semantic-release-telegram/commit/0ee4167d974808539e5b749ec2d43fc61599d8eb))
`;

    const verified = { name: 'test-app', templates, chats: [ 1, 2 ], repository, 'telegra.ph': telegraph };

    await success.call(
        { verified },
        null,
        { 
            logger: console, 
            nextRelease: { version: '1.0.2', type: 'patch', notes } 
        }
    );

    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=createPage'), 1);
    assert.lengthOf(await factory.getApiCalls('type=requestSent&url=sendMessage'), 2*2);
});

test('Negative: missing verify', async function () {
    const promise = success.call(
        {},
        {},
        {
            logger : console
        }
    );

    await checkError(promise, 'VERIFICATION_MISSED', 'verifyConditions should be passed to run step [success]');
});

after(function () {
    factory.unMockAPI();
});
