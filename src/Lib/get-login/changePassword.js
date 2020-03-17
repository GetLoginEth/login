import Logger from "./logger";
import {CODE_EMPTY_RESULT, CODE_UNKNOWN_METHOD, CODE_USERNAME_NOT_FOUND, LoginError} from "./login-error";
import {
    createWallet,
    dataToV3Wallet,
    decryptWallet, encryptWallet,
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
export const LOG_CHANGE_PASSWORD = 'log_change_password';

export const LOGIN_USERNAME_PASSWORD = 'login_username_password';
export const LOGIN_DATA = 'login_data';
export const LOGIN_WEB3_PROVIDER = 'login_web3_provider';

export default class ChangePassword extends Logger {
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

    async _changePassword(username, oldPassword, newPassword) {
        const {web3} = this.crypto;

        this.log(LOG_LOG_IN_CHECK_PASSWORD);
        await validatePassword(oldPassword);
        await validatePassword(newPassword);

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
        await decryptWallet(web3, encryptedWalletData, oldPassword);
        const newDecryptedWallet = createWallet(web3);
        const newEncryptedWallet = encryptWallet(newDecryptedWallet, newPassword);
        // todo log this event
        // todo set new wallet as owner + move all funds to new wallet
        this.log(LOG_CHANGE_PASSWORD);
        await this.contract.changePassword('0.1',
            '0x' + newEncryptedWallet.address,
            newEncryptedWallet.crypto.ciphertext,
            newEncryptedWallet.crypto.cipherparams.iv,
            newEncryptedWallet.crypto.kdfparams.salt,
            newEncryptedWallet.crypto.mac);

        return true;
    }

    async changePassword(username, oldPassword, newPassword) {
        let result = await this._changePassword(username, oldPassword, newPassword);

        if (!result) {
            throw new LoginError(CODE_EMPTY_RESULT);
        }

        return result;
    }
}
