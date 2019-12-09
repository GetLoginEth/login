import Logger from "./logger";
import {
    CODE_EMPTY_RESULT,
    CODE_NOT_IMPLEMENTED,
    CODE_UNKNOWN_METHOD,
    CODE_USERNAME_ALREADY_REGISTERED, CODE_USERNAME_NOT_FOUND,
    LoginError
} from "./login-error";
import {validatePassword, validateUsername, sleep, LOGIN_TREZOR, isUsernameRegistered, validateWallet} from "./utils";

export const LOG_LOG_IN_CHECK_USERNAME = 'log_in_check_username';
export const LOG_LOG_IN_RECEIVE_WALLET = 'log_in_receive_wallet';
export const LOG_LOG_IN_CHECK_PASSWORD = 'log_in_check_password';
export const LOG_LOG_IN_CHECK_WALLET = 'log_in_check_wallet';
export const LOG_LOG_IN_DECODE_WALLET = 'log_in_decode_wallet';

export const LOGIN_USERNAME_PASSWORD = 'login_username_password';
export const LOGIN_DATA = 'login_data';

export default class Signin extends Logger {
    async _signInUsernamePassword(username, password) {
        this.log(LOG_LOG_IN_CHECK_USERNAME);
        await sleep(1000);
        await validateUsername(username);
        this.log(LOG_LOG_IN_CHECK_PASSWORD);
        await validatePassword(password);

        if (!await isUsernameRegistered(username)) {
            throw new LoginError(CODE_USERNAME_NOT_FOUND);
        }

        this.log(LOG_LOG_IN_RECEIVE_WALLET);
        await sleep(1000);

        return true;
    }

    async _signInWalletPassword(username, password, wallet) {
        this.log(LOG_LOG_IN_CHECK_USERNAME);
        await validateUsername(username);
        this.log(LOG_LOG_IN_CHECK_PASSWORD);
        await validatePassword(password);
        this.log(LOG_LOG_IN_CHECK_WALLET);
        await validateWallet(password);

        // todo fast check is wallet associated with username?
        // todo try to decode wallet with password

        /*if (!await isUsernameRegistered(username)) {
            throw new LoginError(CODE_USERNAME_NOT_FOUND);
        }*/

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
            case LOGIN_DATA:
                console.log(data);
                result = await this._signInWalletPassword(...data);
                break;
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
