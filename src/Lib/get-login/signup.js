import {
    CODE_EMPTY_RESULT, CODE_INCORRECT_INVITE, CODE_NOT_ENOUGH_FUNDS,
    CODE_NOT_IMPLEMENTED,
    CODE_UNKNOWN_METHOD,
    CODE_USERNAME_ALREADY_REGISTERED,
    LoginError
} from "./login-error";
import {INVITE_LENGTH, isUsernameRegistered, LOGIN_TREZOR, LOGIN_WEB3, sleep} from "./utils";
import Logger from "./logger";
import {IInviteRegistration} from "./interfaces";

export const LOG_SIGN_UP_CHECK_FUNDS = 'sign_up_check_funds';
export const LOG_SIGN_UP_CHECK_USERNAME = 'sign_up_check_username';
export const LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE = 'sign_up_create_wallet_from_invite';
export const LOG_SIGN_UP_CREATE_NEW_WALLET = 'sign_up_create_new_wallet';
export const LOG_SIGN_UP_USER_REGISTRATION = 'sign_up_user_registration';

export const SIGN_UP_INVITE = 'sign_up_invite';

export default class Signup extends Logger {
    constructor() {
        super();

        this.errors = [
            {
                code: 1,
                text: ''
            }
        ];
    }

    async createInvite() {

    }

    async isCorrectInvite(invite) {
        // todo implement
        return typeof invite === 'string' && invite.length === INVITE_LENGTH;
    }

    async isEnoughFundsRegistration(invite) {
        // todo implement
        return true;
    }

    async _createWallet(password) {
        // todo implement
        return {
            some: 'wallet',
            data: 'fwef23'
        }
    }

    async _createAccountFromWallet(username, fundedWallet, newWallet) {
        // todo implement
        return '0x23rgbwekfnwiugh3487weg3uhru';
    }

    async _createWalletFromInvite(invite) {
        // todo implement
        // create transaction data
        // send transaction

        return {
            test: 'test'
        };
    }

    /**
     *
     * @param username
     * @param password
     * @param invite
     * @returns {Promise<IInviteRegistration>}
     * @private
     */
    async _signUpInvite(username, password, invite) {
        if (!await this.isCorrectInvite(invite)) {
            throw new LoginError(CODE_INCORRECT_INVITE);
        }

        this.log(LOG_SIGN_UP_CHECK_FUNDS);
        await sleep(1000);

        this.log(LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE);
        await sleep(1000);
        const fundedWallet = await this._createWalletFromInvite(invite);

        if (!await this.isEnoughFundsRegistration(fundedWallet.address)) {
            throw new LoginError(CODE_NOT_ENOUGH_FUNDS);
        }

        this.log(LOG_SIGN_UP_CREATE_NEW_WALLET);
        await sleep(1000);
        const newWallet = await this._createWallet(password);

        this.log(LOG_SIGN_UP_USER_REGISTRATION);
        await sleep(1000);
        const registrationTransaction = this._createAccountFromWallet(username, fundedWallet, newWallet);

        return new IInviteRegistration(newWallet, registrationTransaction);
    }

    /**
     *
     * @param method
     * @param username
     * @param password
     * @param invite
     * @returns {Promise<IInviteRegistration>}
     */
    async signUp(method, username, password = '', invite = '') {
        let result = null;

        this.log(LOG_SIGN_UP_CHECK_USERNAME);
        await sleep(1000);
        if (await isUsernameRegistered(username)) {
            throw new LoginError(CODE_USERNAME_ALREADY_REGISTERED);
        }

        switch (method) {
            case SIGN_UP_INVITE:
                result = await this._signUpInvite(username, password, invite);
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
