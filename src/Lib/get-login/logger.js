export const LOG_PREFIX = 'get_login_';

export default class Logger {
    constructor() {
        this.logger = null;
    }

    setLogger(logger) {
        this.logger = logger;
    }

    getLogger() {
        return this.logger;
    }

    log(type, data = {}) {
        if (this.logger) {
            this.logger.log(LOG_PREFIX + type, data);
        }
    }
}
