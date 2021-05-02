import { VERIFICATION_MISSED } from './Error';
import Telegram from './telegram';
import { getVariables } from './utils';


export default async function success(pluginConfig, { logger, nextRelease, options, branch }) {
    if (!this.verified) throw new VERIFICATION_MISSED('success');
    const { chats, botID, botToken, templates } = this.verified;
    const telegram = new Telegram(botID, botToken, chats);
    const variables = getVariables({ verified: this.verified, nextRelease, options, branch });


    await telegram.send(templates.success, variables);

    logger.log('Notifications has sent successfully');
}

