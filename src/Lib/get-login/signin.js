import Logger from "./logger";
import {
    CODE_EMPTY_RESULT,
    CODE_NOT_IMPLEMENTED,
    CODE_UNKNOWN_METHOD,
    CODE_USERNAME_NOT_FOUND,
    LoginError
} from "./login-error";
import {
    dataToV3Wallet,
    decryptWallet, filterUsername,
    getUsernameHash,
    isUsernameRegistered,
    LOGIN_TREZOR,
    validatePassword,
    validateUsername
} from "./utils";

export const LOG_LOG_IN_CHECK_USERNAME = 'log_in_check_username';
export const LOG_LOG_IN_RECEIVE_WALLET = 'log_in_receive_wallet';
export const LOG_LOG_IN_CHECK_PASSWORD = 'log_in_check_password';
export const LOG_LOG_IN_CHECK_WALLET = 'log_in_check_wallet';
export const LOG_LOG_IN_DECODE_WALLET = 'log_in_decode_wallet';

export const LOGIN_USERNAME_PASSWORD = 'login_username_password';
export const LOGIN_DATA = 'login_data';

export default class Signin extends Logger {
    constructor(crypto, contract) {
        super();

        /**
         *
         * @type {crypto}
         */
        this.crypto = crypto;

        /**
         *
         * @type {contract}
         */
        this.contract = contract;
    }

    /**
     *
     * @param username
     * @param password
     * @returns {Promise<boolean>}
     * @private
     */
    async _signInUsernamePassword(username, password) {
        const {web3} = this.crypto;

        this.log(LOG_LOG_IN_CHECK_PASSWORD);
        await validatePassword(password);

        this.log(LOG_LOG_IN_CHECK_USERNAME);
        username = filterUsername(username);
        await validateUsername(username);
        if (!await isUsernameRegistered(this.contract, username)) {
            throw new LoginError(CODE_USERNAME_NOT_FOUND);
        }

        this.log(LOG_LOG_IN_RECEIVE_WALLET);
        const usernameHash = getUsernameHash(web3, username);
        const txInfo = await this.contract.findWalletInLogs(usernameHash);
        if (!txInfo) {
            throw new Error('Wallet for this username not found');
        }
        
        const encryptedWalletData = dataToV3Wallet(txInfo);
        await decryptWallet(web3, encryptedWalletData, password);

        return true;
    }

    /**
     *
     * @param username
     * @param password
     * @param wallet
     * @returns {Promise<boolean>}
     * @private
     */
    async _signInWalletPassword(username, password, wallet) {
        const {web3} = this.crypto;

        this.log(LOG_LOG_IN_CHECK_USERNAME);
        await validateUsername(username);
        this.log(LOG_LOG_IN_DECODE_WALLET);
        const decodedWallet = await decryptWallet(web3, wallet, password);

        // todo fast check is wallet associated with username?
        // todo try to decode wallet with password

        /*if (!await isUsernameRegistered(username)) {
            throw new LoginError(CODE_USERNAME_NOT_FOUND);
        }*/

        return true;
    }

    /**
     *
     * @param method
     * @param username
     * @param password
     * @param wallet
     * @returns {Promise<boolean>}
     */
    async signIn(method, username, password, wallet) {
        let result = null;

        switch (method) {
            case LOGIN_USERNAME_PASSWORD:
                result = await this._signInUsernamePassword(username, password);
                break;
            case LOGIN_DATA:
                result = await this._signInWalletPassword(username, password, wallet);
                break;
            case LOGIN_TREZOR:
                throw new LoginError(CODE_NOT_IMPLEMENTED);
            default:
                throw new LoginError(CODE_UNKNOWN_METHOD);
        }

        if (!result) {
            throw new LoginError(CODE_EMPTY_RESULT);
        }

        return true;
    }
}
