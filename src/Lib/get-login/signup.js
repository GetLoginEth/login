import {
    CODE_EMPTY_RESULT,
    CODE_NOT_IMPLEMENTED,
    CODE_UNKNOWN_METHOD,
    CODE_USERNAME_ALREADY_REGISTERED,
    LoginError
} from "./login-error";
import {
    createWallet,
    encryptWallet,
    filterUsername,
    getUsernameHash,
    isUsernameRegistered,
    LOGIN_TREZOR,
    LOGIN_WEB3,
    sleep,
    validateInvite,
    validateMoreThanZero,
    validateUsername
} from "./utils";
import Logger from "./logger";
import {IInviteRegistration} from "./interfaces";

export const LOG_SIGN_UP_CHECK_FUNDS = 'sign_up_check_funds';
export const LOG_SIGN_UP_CHECK_USERNAME = 'sign_up_check_username';
export const LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE = 'sign_up_create_wallet_from_invite';
export const LOG_SIGN_UP_CREATE_NEW_WALLET = 'sign_up_create_new_wallet';
export const LOG_SIGN_UP_USER_REGISTRATION = 'sign_up_user_registration';

export const SIGN_UP_INVITE = 'sign_up_invite';

export default class Signup extends Logger {
    constructor(crypto, contract) {
        super();

        this.errors = [
            {
                code: 1,
                text: ''
            }
        ];

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

    async isEnoughFundsRegistration(invite) {
        // todo implement
        return true;
    }

    /*async _createWallet(password) {
        // todo implement
        return {
            some: 'wallet',
            data: 'fwef23',
            address: '0xaaaaa8a77aa67a',
        }
    }*/

    async _createAccountFromWallet(username, fundedWallet, newWallet) {
        // todo implement
        return '0x23rgbwekfnwiugh3487weg3uhru';
    }

    /*async _createWalletFromInvite(invite) {
        // todo implement
        // create transaction data
        // send transaction

        return {
            test: 'test'
        };
    }*/

    /**
     *
     * @param username
     * @param password
     * @param invite
     * @param onTransactionMined
     * @returns {Promise<IInviteRegistration>}
     * @private
     */
    async _signUpInvite(username, password, invite, onTransactionMined) {
        const {web3} = this.crypto;

        username = filterUsername(username);
        console.log(username);

        const usernameHash = getUsernameHash(web3, username);
        validateInvite(invite);
        validateUsername(username);

        this.log(LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE);
        const inviteWallet = await this.crypto.getWalletFromInvite(invite);
        //console.log(inviteWallet);
        this.contract.setPrivateKey(inviteWallet.privateKey);

        if (!await this.contract.isInviteExists(inviteWallet.address)) {
            throw new Error('Invite is not active or already used');
        }

        this.log(LOG_SIGN_UP_CHECK_FUNDS);
        const balanceEth = web3.utils.fromWei(await web3.eth.getBalance(inviteWallet.address));
        validateMoreThanZero(balanceEth);
        console.log('Invite balance', balanceEth);

        this.log(LOG_SIGN_UP_CREATE_NEW_WALLET);
        const decryptedWallet = createWallet(web3);
        const encryptedWallet = encryptWallet(decryptedWallet, password);
        //console.log(encryptedWallet);
        this.log(LOG_SIGN_UP_USER_REGISTRATION);
        const info = await this.contract.createUserFromInvite(
            usernameHash,
            '0x' + encryptedWallet.address,
            encryptedWallet.crypto.ciphertext,
            encryptedWallet.crypto.cipherparams.iv,
            encryptedWallet.crypto.kdfparams.salt,
            encryptedWallet.crypto.mac);
        if (onTransactionMined) {
            onTransactionMined(info);
        }

        return new IInviteRegistration(encryptedWallet, decryptedWallet);
    }

    /**
     *
     * @param method
     * @param username
     * @param password
     * @param invite
     * @param onTransactionMined
     * @returns {Promise<IInviteRegistration>}
     */
    async signUp(method, username, password = '', invite = '', onTransactionMined) {
        let result = null;

        this.log(LOG_SIGN_UP_CHECK_USERNAME);
        await sleep(1000);
        if (await isUsernameRegistered(this.contract, username)) {
            throw new LoginError(CODE_USERNAME_ALREADY_REGISTERED);
        }

        switch (method) {
            case SIGN_UP_INVITE:
                result = await this._signUpInvite(username, password, invite, onTransactionMined);
                break;
            case LOGIN_WEB3:
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
