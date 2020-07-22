import Logger from "./logger";
import {CODE_EMPTY_RESULT, CODE_UNKNOWN_METHOD, CODE_USERNAME_NOT_FOUND, LoginError} from "./login-error";
import {
    dataToV3Wallet,
    decryptWallet,
    filterUsername,
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
export const LOGIN_WEB3_PROVIDER = 'login_web3_provider';

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

        return await decryptWallet(web3, encryptedWalletData, password);
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
        await decryptWallet(web3, wallet, password);

        return true;
    }

    async _signInTrezor(username, address) {
        const {web3} = this.crypto;

        console.log(username, address);
        this.log(LOG_LOG_IN_CHECK_USERNAME);
        username = filterUsername(username);
        await validateUsername(username);
        if (!await isUsernameRegistered(this.contract, username)) {
            throw new LoginError(CODE_USERNAME_NOT_FOUND);
        }

        const usernameHash = getUsernameHash(web3, username);
        await this.contract.getUserSession(usernameHash, address);

        return true;
    }

    /**
     *
     * @param method
     * @param username
     * @param password
     * @param wallet
     * @param options
     * @returns {Promise<boolean>}
     */
    async signIn(method, username, password, wallet, options = {}) {
        let result = null;

        switch (method) {
            case LOGIN_USERNAME_PASSWORD:
                result = await this._signInUsernamePassword(username, password);
                break;
            case LOGIN_DATA:
                result = await this._signInWalletPassword(username, password, wallet);
                break;
            case LOGIN_TREZOR:
                result = await this._signInTrezor(username, options.address);
                break;
            default:
                throw new LoginError(CODE_UNKNOWN_METHOD);
        }

        if (!result) {
            throw new LoginError(CODE_EMPTY_RESULT);
        }

        return result;
    }
}
