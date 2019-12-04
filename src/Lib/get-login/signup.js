import {
    CODE_EMPTY_RESULT, CODE_INCORRECT_INVITE, CODE_NOT_ENOUGH_FUNDS,
    CODE_NOT_IMPLEMENTED,
    CODE_UNKNOWN_METHOD,
    CODE_USERNAME_ALREADY_REGISTERED,
    LoginError
} from "./login-error";
import {INVITE_LENGTH} from "./utils";
import Logger from "./logger";

/*export const LOG_SIGN_IN_START = 'sign_in_start';
export const LOG_SIGN_IN_COMPLETE = 'sign_in_complete';
export const LOG_SIGN_UP_START = 'sign_up_start';
export const LOG_SIGN_UP_COMPLETE = 'sign_up_complete';*/

export const SIGN_UP_INVITE = 'sign_up_invite';
export const SIGN_UP_WEB3 = 'sign_up_web3';
export const SIGN_UP_TREZOR = 'sign_up_trezor';

//export const SIGN_UP_RESULT_SUCCESS = 'success';
//export const SIGN_UP_RESULT_ERROR = 'error';
//export const SIGN_UP_ERROR_METHOD_NOT_SUPPORTED = 'Method not supported';

export default class Signup extends Logger{
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

    async getUsernameHash(username) {
        // todo implement
        return 'hash_of_' + username;
    }

    async isUsernameRegistered(username) {
        // todo implement
        const usernameHash = await this.getUsernameHash(username);
        return username === 'admin';
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

    async _signUpInvite(username, password, invite) {
        if (!await this.isCorrectInvite(invite)) {
            throw new LoginError(CODE_INCORRECT_INVITE);
        }

        if (!await this.isEnoughFundsRegistration(invite)) {
            throw new LoginError(CODE_NOT_ENOUGH_FUNDS);
        }

        const fundedWallet = await this._createWalletFromInvite(invite);
        const newWallet = await this._createWallet(password);
        const accountTransaction = this._createAccountFromWallet(username, fundedWallet, newWallet);

        return {
            walletData: newWallet,
            accountTransaction
        };
    }

    async signUp(method, username, password = '', invite = '') {
        //this.log(LOG_SIGN_UP_START, {method});
        let result = null;

        if (await this.isUsernameRegistered(username)) {
            throw new LoginError(CODE_USERNAME_ALREADY_REGISTERED);
        }

        switch (method) {
            case SIGN_UP_INVITE:
                result = await this._signUpInvite(username, password, invite);
                break;
            case SIGN_UP_WEB3:
                //setResult(SIGN_UP_RESULT_SUCCESS);
                throw new LoginError(CODE_NOT_IMPLEMENTED);

            //break;
            case SIGN_UP_TREZOR:
                //setResult(SIGN_UP_RESULT_SUCCESS);
                throw new LoginError(CODE_NOT_IMPLEMENTED);

            //break;
            default:
                throw new LoginError(CODE_UNKNOWN_METHOD);
        }

        if (!result) {
            throw new LoginError(CODE_EMPTY_RESULT);
        }

        //this.log(LOG_SIGN_UP_COMPLETE, result);

        return result;
    }
}
