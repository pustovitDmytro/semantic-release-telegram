
import { VERIFICATION_MISSED } from './Error';
import Telegram, { Telegraph } from './telegram';
import { getVariables } from './utils';


export default async function success(pluginConfig, { logger, nextRelease, options, branch }) {
    if (!this.verified) throw new VERIFICATION_MISSED('success');
    const { chats, botID, botToken, templates, assets } = this.verified;
    const telegram = new Telegram(botID, botToken, chats);
    const variables = getVariables({ verified: this.verified, nextRelease, options, branch });

    const telegraphConfig = this.verified['telegra.ph'];

    if (telegraphConfig) {
        const config = telegraphConfig;
        const telegraph = new Telegraph(config.token);

        const telegraphVariables = await telegraph.send(config.title, config.content, variables);

        Object.assign(variables, telegraphVariables);
    }

    await telegram.send(templates.success, variables, { files: assets, telegraph: telegraphConfig  });

    logger.log('Notifications have been sent successfully');
}

