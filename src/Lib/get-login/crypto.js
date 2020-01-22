import defaultConfig from '../../config';
import Web3 from 'web3';

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
    }

    getAccount() {
        return this.currentAccount;
    }
}
