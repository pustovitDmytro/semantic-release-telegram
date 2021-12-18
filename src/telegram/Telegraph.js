import remarkParse from 'remark-parse';
import unified from 'unified';
import { isFunction, isString, isObject, fill } from 'myrmidon';
import Api from './TelegraphAPI';

function dumpAccount(account) {
    return account.short_name;
}

function dumpPage(page) {
    return {
        'telegraph_url'   : page.url,
        'telegraph_title' : page.title
    };
}

const Tags = {
    text : node => node.value,

    softbreak        : 'br',
    linebreak        : 'br',
    'thematic_break' : 'br',

    emph   : 'em',
    strong : 'strong',

    link  : node => ({ tag: 'a', attrs: { href: node.url } }),
    image : node => ({ tag: 'img', attrs: { href: node.url } }),

    code         : node => ({ tag: 'code', children: node.value }),
    'code_block' : node => ({ tag: 'code', children: node.value }),

    'block_quote' : 'blockquote',

    heading : node => ({ tag: node.depth === 1 ? 'h3' : 'h4' }),
    list    : node => ({ tag: node.ordered ? 'ol' : 'ul' }),

    listItem  : 'li',
    paragraph : 'p'

};

class Visitor {
    constructor(tags) {
        this.tags = tags;
    }

    visit = (node) => {
        const result = {};
        const handler = this.tags[node.type];

        if (handler) {
            if (isFunction(handler)) {
                const parsed = handler(node);

                if (isObject(parsed)) {
                    Object.assign(result, parsed);
                }

                if (isString(parsed)) return parsed;
            }

            if (isString(handler)) {
                result.tag = handler;
            }
        }

        if (node.children) {
            result.children = node.children.map(n => this.visit(n));
            if (node.type === 'root') return result.children;
        }

        return result;
    }
}


function remarkPlugin() {
    const visitor = new Visitor(Tags);

    function Compiler(tree) {
        return JSON.stringify(visitor.visit(tree));
    }

    Object.assign(this, { Compiler });
}

export default class Telegraph {
    constructor(token) {
        this.api = new Api(token);
    }

    async send(title, message, variables) {
        const mdTitle = fill(title, variables);
        const mdMessage = fill(message, variables);

        const content = await unified()
            .use(remarkParse)
            .use(remarkPlugin)
            .process(mdMessage);

        const page = await this.api.createPage(mdTitle, String(content));

        return dumpPage(page);
    }

    async authorize() {
        const account = await this.api.createAccount('Semantic Release Telegram');

        this.api.setToken(account.access_token);

        return account.access_token;
    }

    async test() {
        const account = await this.api.getAccountInfo();

        return dumpAccount(account);
    }
}

