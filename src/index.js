import verifyConditionsFn from './verifyConditions';
import successFn from './success';
import failFn from './fail';

const context = {};

const verifyConditions = verifyConditionsFn.bind(context);
const success          = successFn.bind(context);
const fail             = failFn.bind(context);

export {
    verifyConditions,
    success,
    fail
};
