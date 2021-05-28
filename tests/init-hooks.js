import { v4 as uuid } from 'uuid';
import { createNamespace } from 'cls-hooked';

const context = createNamespace('__TEST__');

beforeEach(function setClsFromContext() {
    const old = this.currentTest.fn;

    this.currentTest._TRACE_ID = uuid();
    this.currentTest.fn = function clsWrapper() {
        return new Promise((res, rej) => {
            context.run(() => {
                context.set('current', {
                    test  : this.test.title,
                    suite : this.test.parent.title,
                    body  : this.test.body,
                    id    : this.test._TRACE_ID
                });
                Promise.resolve(Reflect.apply(old, this, arguments))
                    // eslint-disable-next-line promise/prefer-await-to-then
                    .then(res).catch(rej);
            });
        });
    };
});
