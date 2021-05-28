import { assert } from 'chai';
import { verifyConditions, success, fail } from '../entry';
import '../Test';

suite('Configurations');

test('verifyConditions', function () {
    assert.isFunction(verifyConditions);
});

test('success', function () {
    assert.isFunction(success);
});

test('fail', function () {
    assert.isFunction(fail);
});
