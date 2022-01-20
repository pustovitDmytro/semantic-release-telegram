import remarkParse from 'remark-parse';
import unified from 'unified';
import { fill } from 'myrmidon';
import remarkTelegraph from 'remark-telegraph';
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

export default class Telegraph {
    constructor(token) {
        this.api = new Api(token);
    }

    async send(title, message, variables) {
        const mdTitle = fill(title, variables);
        const mdMessage = fill(message, variables);

        const content = await unified()
            .use(remarkParse)
            .use(remarkTelegraph)
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

