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
    validateInvite,
    validateMoreThanZero,
    validateUsername
} from "./utils";
import Logger from "./logger";
import {IInviteRegistration} from "./interfaces";
/*import TrezorConnect from 'trezor-connect';*/
import TrezorConnect from "../../Lib/get-login/crypto";

import HdKey from "ethereumjs-wallet/hdkey";
import {ethers, providers} from "ethers";
import tokenData from "../../smart-bzz/build/contracts/Token.out.json";
import {getConfig} from "../../config";

export const LOG_SIGN_UP_CHECK_FUNDS = 'sign_up_check_funds';
export const LOG_SIGN_UP_CHECK_USERNAME = 'sign_up_check_username';
export const LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE = 'sign_up_create_wallet_from_invite';
export const LOG_SIGN_UP_CREATE_NEW_WALLET = 'sign_up_create_new_wallet';
export const LOG_SIGN_UP_USER_REGISTRATION = 'sign_up_user_registration';
export const LOG_SIGN_UP_BZZ_APPROVE = 'sign_up_bzz_approve';
export const LOG_SIGN_UP_BZZ_TRANSFER = 'sign_up_bzz_transfer';

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

    /**
     *
     * @param username
     * @param password
     * @param invite
     * @param allowReset
     * @param onTransactionMined
     * @returns {Promise<IInviteRegistration>}
     * @private
     */
    async _signUpInvite(username, password, invite, allowReset, onTransactionMined) {
        const {web3} = this.crypto;

        const currentNetwork = process.env.REACT_APP_NETWORK;
        const envConfig = getConfig(currentNetwork);
        const provider = new providers.JsonRpcProvider(envConfig.jsonRpcProvider);
        const signer = new ethers.Wallet(invite).connect(provider);
        const bzzContract = new ethers.Contract(envConfig.bzz.address, tokenData.abi, signer);

        username = filterUsername(username);
        const usernameHash = getUsernameHash(web3, username);
        validateInvite(invite);
        validateUsername(username);

        this.log(LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE);
        const inviteWallet = await this.crypto.getAccountFromInvite(invite);
        await this.contract.setPrivateKey(inviteWallet.privateKey);

        if (!await this.contract.isInviteExists(inviteWallet.address)) {
            throw new Error('Invite is not active or already used');
        }

        this.log(LOG_SIGN_UP_CHECK_FUNDS);
        const balanceEth = web3.utils.fromWei(await web3.eth.getBalance(inviteWallet.address));
        validateMoreThanZero(balanceEth);

        this.log(LOG_SIGN_UP_CREATE_NEW_WALLET);
        const decryptedWallet = createWallet(web3);
        const encryptedWallet = encryptWallet(decryptedWallet, password);
        this.log(LOG_SIGN_UP_USER_REGISTRATION);
        const address = '0x' + encryptedWallet.address;

        this.log(LOG_SIGN_UP_BZZ_APPROVE);
        const bzzBalance = await bzzContract.balanceOf(inviteWallet.address);
        if (bzzBalance.toString() !== '0') {
            let tx = await bzzContract.approve(address, bzzBalance);
            await tx.wait();

            this.log(LOG_SIGN_UP_BZZ_TRANSFER);
            await bzzContract.transfer(address, bzzBalance);
            await tx.wait();
        }

        const info = await this.contract.createUserFromInvite(
            usernameHash,
            address,
            encryptedWallet.crypto.ciphertext,
            encryptedWallet.crypto.cipherparams.iv,
            encryptedWallet.crypto.kdfparams.salt,
            encryptedWallet.crypto.mac,
            allowReset);

        if (onTransactionMined) {
            onTransactionMined(info);
        }

        return new IInviteRegistration(encryptedWallet, decryptedWallet);
    }

    async _signUpTrezor(username, options) {
        const {web3} = this.crypto;

        if (!options || !options.address || isNaN(options.addressIndex)) {
            throw new LoginError('Not selected Trezor address');
        }

        console.log(options);
        const externalAddress = options.address;
        const addressIndex = options.addressIndex;

        username = filterUsername(username);
        //console.log(username);

        const usernameHash = getUsernameHash(web3, username);
        validateUsername(username);

        const path = `m/44'/60'/0'/0/${addressIndex}`;

        this.log(LOG_SIGN_UP_CHECK_FUNDS);
        const balanceEth = web3.utils.fromWei(await web3.eth.getBalance(externalAddress));
        validateMoreThanZero(balanceEth);

        this.contract.setExternalSign(async transaction => {
            //console.log('External called');
            //console.log(transaction);
            const result = await TrezorConnect.ethereumSignTransaction({
                path,
                transaction
            });
            //console.log(result);
            if (!result.success) {
                throw new LoginError(result.payload.error);
            }

            return result.payload;
        }, externalAddress);
        return await this.contract.createUser(usernameHash);
    }

    /**
     *
     * @param method
     * @param username
     * @param password
     * @param invite
     * @param onTransactionMined
     * @param options
     * @returns {Promise<IInviteRegistration>}
     */
    async signUp(method, username, password = '', invite = '', onTransactionMined = null, options = {}) {
        let result = null;

        this.log(LOG_SIGN_UP_CHECK_USERNAME);
        if (await isUsernameRegistered(this.contract, username)) {
            throw new LoginError(CODE_USERNAME_ALREADY_REGISTERED);
        }

        // todo check is address registered (actual for trezor)

        switch (method) {
            case SIGN_UP_INVITE:
                result = await this._signUpInvite(username, password, invite, options.allowReset, onTransactionMined);
                break;
            case LOGIN_WEB3:
                throw new LoginError(CODE_NOT_IMPLEMENTED);
            case LOGIN_TREZOR:
                result = await this._signUpTrezor(username, options);
                break;
            default:
                throw new LoginError(CODE_UNKNOWN_METHOD);
        }

        if (!result) {
            throw new LoginError(CODE_EMPTY_RESULT);
        }

        return result;
    }

    async getTrezorInfo() {
        const pathPublicKey = `m/44'/60'/0'/0`;
        const responsePublicKey = await TrezorConnect.getPublicKey({
            path: pathPublicKey,
            coin: "tRIN"
        });
        console.log(responsePublicKey);
        const extPubKey = responsePublicKey.payload.xpub;
        const hdWallet = HdKey.fromExtendedKey(extPubKey);
        let result = {
            publicKey: hdWallet.deriveChild(0).getWallet().getPublicKey().toString('hex'),
            addresses: []
        };
        for (let i = 0; i < 20; i++) {
            result.addresses.push({
                address: hdWallet.deriveChild(i).getWallet().getAddressString(),
                index: i
            });
        }

        return result;
    }

    /*async getPrice() {
        const {web3} = this.crypto;

        const decryptedWallet = createWallet(web3);
        const encryptedWallet = encryptWallet(decryptedWallet, 'hello');
        console.log(encryptedWallet);
        let data = await this.contract.prepareTx('createUserFromInvite',
            {...this.contract.sendTxDefault, balanceEther: 'all'},
            web3.utils.keccak256('admin'),
            decryptedWallet.address,
            encryptedWallet.crypto.ciphertext,
            encryptedWallet.crypto.cipherparams.iv,
            encryptedWallet.crypto.kdfparams.salt,
            encryptedWallet.crypto.mac, true);

        return web3.utils.fromWei(await this.contract.calculateEstimateGas(data));
    }*/
}
