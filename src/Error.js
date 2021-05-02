export default class SemanticReleaseTelegramError extends Error {
    #payload;

    constructor(payload) {
        super();

        this.name = this.constructor.name;
        this.#payload = payload;

        Error.captureStackTrace(this, this.constructor);
    }

    get payload() {
        return this.#payload;
    }
}

export class VERIFICATION_MISSED extends SemanticReleaseTelegramError {
    message = `verifyConditions should be passed to run step [${this.payload}]`
}

export class VALIDATION_FAILED extends SemanticReleaseTelegramError {
    message = JSON.stringify(this.payload)
}

export class API_ERROR extends SemanticReleaseTelegramError {
    get message() {
        const messages = [ this.payload.toString() ];
        const inner  = this.payload.response?.data;

        if (inner) messages.push(JSON.stringify(inner));

        return messages.join(' ');
    }
}
