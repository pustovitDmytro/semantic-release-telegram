import LIVR         from 'livr';
import extraRules   from 'livr-extra-rules';
import GitUrlParse from 'git-url-parse';
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

export function getVariables({ verified, nextRelease, error }) {
    const { repository, name, branch } = verified;
    const repoUrl = GitUrlParse(repository.url);

    if (repository.dropHTTPSAuth && repoUrl.protocol === 'https' && repoUrl.user) repoUrl.user = '';

    return {
        name,
        branch,
        'repository_url' : repoUrl.toString(repository.protocol),
        'version'        : nextRelease?.version,
        'release_notes'  : nextRelease?.notes,
        'release_type'   : nextRelease?.type,
        'commit'         : nextRelease?.commit,
        'error'          : error?.toString()
    };
}
