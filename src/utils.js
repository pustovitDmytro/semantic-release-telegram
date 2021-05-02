import LIVR         from 'livr';
import extraRules   from 'livr-extra-rules';
import { VALIDATION_FAILED } from './Error';

LIVR.Validator.registerDefaultRules(extraRules);

export function validate(data, rules) {
    const validator = new LIVR.Validator(rules).prepare();
    const result = validator.validate(data);

    if (!result) {
        const fields = validator.getErrors();

        throw new VALIDATION_FAILED(fields);
    }

    return result;
}

export function getVariables({ verified, nextRelease, options, branch, error }) {
    return {
        'repository_url' : options?.repositoryUrl,
        'name'           : verified.name,
        'version'        : nextRelease?.version,
        'release_notes'  : nextRelease?.notes,
        'release_type'   : nextRelease?.type,
        'commit'         : nextRelease?.commit,
        'branch'         : branch?.name,
        'error'          : error?.toString()
    };
}
