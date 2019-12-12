export const defaultAddresses = {
    "rinkeby": "",
    "mainnet": ""
};

export const defaultAbi = {};

export default class contract {
    constructor(web3, addresses = {}, abi = null) {
        /**
         *
         * @type {Web3}
         */
        this.web3 = web3;
        this.addresses = addresses || defaultAddresses;
        this.abi = abi || defaultAbi;
        this.contract = null;
        this.privateKey = null;
        this.account = null;
    }

    async sendTransaction(transaction) {
        const signedTx = await this.account.signTransaction(transaction);
        const result = await this.web3.eth.sendSignedTransaction(signedTx);

        return result;
    }

    /**
     *
     * @param privateKey Without 0x
     */
    setPrivateKey(privateKey) {
        this.privateKey = privateKey;
        this.account = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
    }

    saveWalletToTransaction(username, wallet) {
        // todo check wallet structure && encoded or not
        // todo send transaction with encoded wallet and username to SC
    }
}
