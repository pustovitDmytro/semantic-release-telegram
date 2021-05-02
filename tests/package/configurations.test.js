import { assert } from 'chai';
import entry from '../entry';
import '../init';

suite('Configurations');

test('Default configuration', function () {
    assert.exists(entry);
});

test('verifyConditions', function () {
    assert.isFunction(entry.verifyConditions);
});

test('success', function () {
    assert.isFunction(entry.success);
});

test('fail', function () {
    assert.isFunction(entry.fail);
});
