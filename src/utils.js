import cottus from 'cottus';
import GitUrlParse from 'git-url-parse';
import { VALIDATION_FAILED } from './Error';

export function validate(data, rules) {
    const validator = cottus.compile([ 'required', { 'attributes': rules } ]);

    try {
        return validator.validate(data);
    } catch (error) {
        throw new VALIDATION_FAILED(JSON.parse(error.prettify));
    }
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
