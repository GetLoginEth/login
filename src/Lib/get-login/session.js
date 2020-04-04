import Logger from "./logger";
import {createWallet} from "./utils";
import EthCrypto from 'eth-crypto';
import {privateToPublic} from "ethereumjs-util";

export const SESSION_CREATE_WALLET = 'session_create_wallet';
export const SESSION_REGISTER_WALLET = 'session_register_wallet';

export default class Session extends Logger {
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

    async encryptWithPublicKey(publicKey, data) {
        return await EthCrypto.encryptWithPublicKey(publicKey, data);
    }

    async decryptWithPrivateKey(privateKey, data) {
        return await EthCrypto.decryptWithPrivateKey(privateKey, data);
    }

    async getPublicKeyFromPrivateKey(privateKey) {
        if (privateKey.indexOf('0x') < 0) {
            privateKey = '0x' + privateKey;
        }

        return privateToPublic(privateKey).toString('hex');
    }

    async createSession(appId, sendBalance = '0.03') {
        const {web3} = this.crypto;

        this.log(SESSION_CREATE_WALLET);
        const wallet = createWallet(web3);

        this.log(SESSION_REGISTER_WALLET);
        console.log('my public key', this.crypto.getPublicKey());
        //const encrypted = await EthCrypto.encryptWithPublicKey(this.crypto.getPublicKey(), wallet.privateKey);
        const encrypted = await this.encryptWithPublicKey(this.crypto.getPublicKey(), wallet.privateKey);
        const createdSession = await this.contract.createAppSession(appId, wallet.address, encrypted.iv, encrypted.ephemPublicKey, encrypted.ciphertext, encrypted.mac, sendBalance);

        return {wallet, createdSession};
    }

    async getSessionInfo(appId, usernameHash) {
        const encryptedSession = await this.contract.getSession(appId, usernameHash);
        if (!encryptedSession) {
            throw new Error('Session not found');
        }

        encryptedSession.privateKey = await this.decryptWithPrivateKey(this.crypto.getAccount().privateKey, encryptedSession.returnValues);

        return encryptedSession;
    }

    async moveFunds(account, toAddress, amount = 'all') {
        const web3 = this.crypto.web3;
        const gas = '21000';
        if (amount === 'all') {
            amount = await web3.eth.getBalance(account.address);
            const costsBN = web3.utils.toBN(await web3.eth.getGasPrice()).mul(web3.utils.toBN(gas));
            amount = web3.utils.toBN(amount).sub(costsBN);
            if (amount.isNeg()) {
                throw new Error("Not enough funds");
            }
        }

        const signedTx = await account.signTransaction({
            to: toAddress,
            value: amount,
            gas
        });

        return this.crypto.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    }

    async closeSession(appId, usernameHash, etherBackAddress) {
        const decryptedSession = await this.getSessionInfo(appId, usernameHash);
        const account = await this.crypto.getAccountFromInvite(decryptedSession.privateKey);
        this.moveFunds(account, etherBackAddress).catch(_ => {
        });
        //return true;
        return this.contract.createEmptyAppSession(appId);
    }
}
