import { assert } from 'chai';
import { load } from '../Test';

const { getVariables } = load('utils');

suite('getVariables');

const repository = {
    url           : 'https://github.com/pustovitDmytro/semantic-release-telegram.git',
    protocol      : 'https',
    dropHTTPSAuth : true
};

test('Keep https url as is', async function () {
    const verified = { repository };

    assert.deepOwnInclude(
        getVariables({ verified }),
        { 'repository_url': repository.url }
    );
});


test('Resolve ssh url', async function () {
    const verified = {
        repository : {
            ...repository,
            url : 'git@github.com:pustovitDmytro/semantic-release-telegram.git'
        }
    };

    assert.deepOwnInclude(
        getVariables({ verified }),
        { 'repository_url': 'https://github.com/pustovitDmytro/semantic-release-telegram.git' }
    );
});

test('Drop basic auth in https url', async function () {
    const verified = {
        repository : {
            ...repository,
            url : 'https://a943eb35-1103-578a-84eb-b7320f67b076@github.com/pustovitDmytro/semantic-release-telegram.git'
        }
    };

    assert.deepOwnInclude(
        getVariables({ verified }),
        { 'repository_url': 'https://github.com/pustovitDmytro/semantic-release-telegram.git' }
    );
});
