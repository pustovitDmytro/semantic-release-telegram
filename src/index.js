import verifyConditions from './verifyConditions';
import success from './success';
import fail from './fail';

const context = {};

module.exports = {
    verifyConditions : verifyConditions.bind(context),
    success          : success.bind(context),
    fail             : fail.bind(context)
};
