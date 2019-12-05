import Logger from "./logger";
import {CODE_EMPTY_RESULT, CODE_NOT_IMPLEMENTED, CODE_UNKNOWN_METHOD, LoginError} from "./login-error";
import {validatePassword, validateUsername, sleep, LOGIN_TREZOR} from "./utils";

export const LOG_LOG_IN_CHECK_USERNAME = 'log_in_check_username';
export const LOG_LOG_IN_RECEIVE_WALLET = 'log_in_receive_wallet';

export const LOGIN_USERNAME_PASSWORD = 'login_username_password';
export const LOGIN_BROWSER_DATA = 'login_browser_data';

export default class Signin extends Logger {
    async _signInUsernamePassword(username, password) {
        this.log(LOG_LOG_IN_CHECK_USERNAME);
        await sleep(1000);
        await validateUsername(username);
        await validatePassword(password);

        this.log(LOG_LOG_IN_RECEIVE_WALLET);
        await sleep(1000);

        return true;
    }

    /**
     * Sign in user
     * @param method
     * @param data
     * @returns {Promise<void>}
     */
    async signIn(method, ...data) {
        let result = null;

        switch (method) {
            case LOGIN_USERNAME_PASSWORD:
                result = await this._signInUsernamePassword(...data);
                break;
            case LOGIN_BROWSER_DATA:
                throw new LoginError(CODE_NOT_IMPLEMENTED);
            case LOGIN_TREZOR:
                throw new LoginError(CODE_NOT_IMPLEMENTED);
            default:
                throw new LoginError(CODE_UNKNOWN_METHOD);
        }

        if (!result) {
            throw new LoginError(CODE_EMPTY_RESULT);
        }

        return result;
    }
}
