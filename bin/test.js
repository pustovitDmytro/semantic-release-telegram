#!./node_modules/.bin/babel-node

import path from 'path';
import { docopt } from 'docopt';
import  success  from '../src/success';
import  verifyConditions  from '../src/verifyConditions';
import  fail  from '../src/fail';

const doc =
`Usage:
   test.js success --chats=<chats> [<rootDir>]
   test.js fail --chats=<chats> [<rootDir>]
   test.js verifyConditions --chats=<chats> [<rootDir>]
   test.js -h | --help

Options:
   -h --help    Run test with real credentials.
`;

async function main(opts) {
    try {
        const chats = opts['--chats'].split(' ');
        const rootDir = opts['<rootDir>'] || process.cwd();
        const options = {
            repositoryUrl : 'https://github.com/pustovitDmytro/semantic-release-telegram.git'
        };
        const branch = { name: 'master' };

        if (opts.success) {
            const notes = '# [1.1.0](https://github.com/pustovitDmytro/semantic-release-test/compare/v1.0.0...v1.1.0) (2021-05-01)\n' +
            '\n' +
            '\n' +
            '### New\n' +
            '\n' +
            // eslint-disable-next-line no-secrets/no-secrets
            '* adds log ([13b1691](https://github.com/pustovitDmytro/semantic-release-test/commit/13b16914f2893fa09e9a39f1dcda78af1fff0dbd))\n' +
            '\n' +
            '\n' +
            '\n';
            const nextRelease = {
                type    : 'minor',
                version : '1.1.0',
                commit  : '13b16914f2893fa09e9a39f1dcda78af1fff0dbd',
                notes
            };

            const context = {};

            await verifyConditions.call(
                context,
                { chats },
                {
                    logger : console,
                    env    : { ...process.env },
                    cwd    : path.resolve(rootDir),
                    options,
                    branch
                }
            );

            await success.call(
                context,
                {},
                { logger: console, nextRelease }
            );
        }

        if (opts.verifyConditions) {
            await verifyConditions.call(
                {},
                { chats },
                {
                    logger : console,
                    env    : { ...process.env },
                    cwd    : path.resolve(rootDir),
                    options,
                    branch
                }
            );
        }

        if (opts.fail) {
            const err = new Error('Cannot push to the Git repository');

            err.name = 'SemanticReleaseError';
            const errors = [ err ];
            const context = {};

            await verifyConditions.call(
                context,
                { chats },
                {
                    logger : console,
                    env    : { ...process.env },
                    cwd    : path.resolve(rootDir),
                    options,
                    branch
                }
            );

            await fail.call(
                context,
                {},
                { logger: console, errors }
            );
        }

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}


main(docopt(doc));
