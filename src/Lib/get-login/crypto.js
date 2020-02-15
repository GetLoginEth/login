import defaultConfig from '../../config';
import Web3 from 'web3';
import {privateToPublic} from "ethereumjs-util";

export default class crypto {
    /**
     *
     * @type Account
     */
    currentAccount = null;

    /**
     *
     * @type {crypto}
     */
    static instance = null;

    constructor(config = null) {
        if (config) {
            this.config = config;
        } else {
            this.config = defaultConfig;
        }

        /**
         *
         * @type {WebsocketProvider}
         */
        this.provider = new Web3.providers.WebsocketProvider(this.config.websocketProviderUrl);
        /**
         *
         * @type {Web3}
         */
        this.web3 = new Web3(this.provider);
        this.publicKey = null;
    }

    /**
     *
     * @param config
     * @returns {crypto}
     */
    static getInstance(config = null) {
        if (!crypto.instance) {
            crypto.instance = new crypto(config);
        }

        return crypto.instance;
    }

    async getWalletFromInvite(invite) {
        if (invite.indexOf('0x') === -1) {
            invite = '0x' + invite;
        }

        return this.web3.eth.accounts.privateKeyToAccount(invite);
    }

    setAccount(privateKey) {
        this.currentAccount = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        if (privateKey.indexOf('0x') < 0) {
            privateKey = '0x' + privateKey;
        }

        this.publicKey = privateToPublic(privateKey).toString('hex');
    }

    setPublicKey(publicKey) {
        this.publicKey = publicKey;
    }

    getPublicKey() {
        return this.publicKey;
    }

    getAccount() {
        return this.currentAccount;
    }
}
