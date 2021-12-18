#!./node_modules/.bin/babel-node

import path from 'path';
import { docopt } from 'docopt';
import success  from '../src/success';
import verifyConditions  from '../src/verifyConditions';
import fail  from '../src/fail';

const doc =
`Usage:
   test.js success --chats=<chats> [<rootDir>]
   test.js fail --chats=<chats> [<rootDir>]
   test.js verifyConditions --chats=<chats> [<rootDir>]
   test.js -h | --help

Options:
   -h --help    Run test with real credentials.
`;

const options = {
    repositoryUrl : 'https://github.com/pustovitDmytro/semantic-release-telegram.git',
    'telegra.ph'  : {
        title   : '{name} v.{version}',
        message : '<a href=\'{telegraph_url}\'>Release Notes</a>',
        content : '{release_notes}'
    },
    assets : [
        { path: 'README.md' },
        { glob: [ '.docs/*' ], name: 'Docs.zip' }
    ]
};
const branch = { name: 'master' };

// eslint-disable-next-line no-secrets/no-secrets
const notes = `
## [1.2.15](https://github.com/pustovitDmytro/semantic-release-telegram/compare/v1.2.14...v1.2.15) (2021-09-09)


### Chore

* fixes audit [devDependencies] ([d08b1fc](https://github.com/pustovitDmytro/semantic-release-telegram/commit/d08b1fc075b7eef59c59f755e1ee96748824e415))
* Lock file maintenance ([47bfacf](https://github.com/pustovitDmytro/semantic-release-telegram/commit/47bfacf4e2ffe672c96345481ddfa6811d4d4d69))
* Lock file maintenance ([19c2389](https://github.com/pustovitDmytro/semantic-release-telegram/commit/19c23891056afb813e4dde92e7f40f0905896bc9))
* Lock file maintenance ([2b00aec](https://github.com/pustovitDmytro/semantic-release-telegram/commit/2b00aec84097bd21c51a43ab785225798753dbae))
* Lock file maintenance ([dea06c9](https://github.com/pustovitDmytro/semantic-release-telegram/commit/dea06c9d3e2dd4448e997ee081425b1a765fae87))
* Lock file maintenance ([e0043d8](https://github.com/pustovitDmytro/semantic-release-telegram/commit/e0043d89de5576939e701f567ab1a871c2c8a057))
* Update devDependencies (non-major) ([73a2388](https://github.com/pustovitDmytro/semantic-release-telegram/commit/73a2388bb59f4bb31566db3fd06fda707b9761a7))
* Update devDependencies (non-major) ([33211c3](https://github.com/pustovitDmytro/semantic-release-telegram/commit/33211c31d168fc187eb028f92eaeeff48ccfd085))
* Update devDependencies (non-major) (#44) ([e8b6f98](https://github.com/pustovitDmytro/semantic-release-telegram/commit/e8b6f98cfd1bb5b89e4211116c86a14e8b296ba1)), closes [#44](https://github.com/pustovitDmytro/semantic-release-telegram/issues/44)

### Upgrade

* Update dependency git-url-parse to v11.6.0 ([0ee4167](https://github.com/pustovitDmytro/semantic-release-telegram/commit/0ee4167d974808539e5b749ec2d43fc61599d8eb))
`;

const nextRelease = {
    type    : 'patch',
    version : '1.2.15',
    commit  : '13b16914f2893fa09e9a39f1dcda78af1fff0dbd',
    notes
};

async function main(opts) {
    try {
        const chats = opts['--chats'].split(' ');
        const rootDir = opts['<rootDir>'] || process.cwd();

        if (opts.success) {
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
