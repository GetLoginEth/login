export default class sessionContract {
    constructor({web3, network, address, abi}) {
        this.address = address;
        this.abi = abi;
        this.web3 = web3;
        this.network = network;
        this.privateKey = null;
        this.contract = null;
        this.defaultSettings = {resolveMethod: 'transactionHash'};
    }

    setPrivateKey(privateKey) {
        if (!privateKey) {
            throw new Error('Incorrect private key');
        }

        if (privateKey.indexOf('0x') === -1) {
            privateKey = '0x' + privateKey;
        }

        this.privateKey = privateKey;
        this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    }

    getContract() {
        if (!this.contract) {
            this.contract = new this.web3.eth.Contract(this.abi, this.address);
        }

        return this.contract;
    }

    async sendTx({method, params, settings = this.defaultSettings}) {
        settings = {...this.defaultSettings, ...settings};
        if (!this.account || !this.address) {
            throw new Error("Fill required fields")
        }

        const data = this.getContract().methods[method](...params).encodeABI();
        const gasPrice = await this.web3.eth.getGasPrice();
        let result = {
            from: this.account.address,
            to: this.address,
            value: this.web3.utils.toWei('0', 'ether'),
            gasLimit: 0,
            gasPrice: gasPrice,
            data
        };
        result.gasLimit = await this.web3.eth.estimateGas(result);
        const signed = await this.web3.eth.accounts.signTransaction(result, this.account.privateKey);
        return new Promise(((resolve, reject) => {
            this.web3.eth.sendSignedTransaction(signed.rawTransaction)
                .on('transactionHash', hash => {
                    console.log(hash);
                    if (settings.onTransactionHash) {
                        settings.onTransactionHash(hash);
                    }

                    if (settings.resolveMethod === 'transactionHash') {
                        resolve(hash);
                    }
                })
                .on('receipt', receipt => {
                    console.log(receipt);
                    if (settings.onReceipt) {
                        settings.onReceipt(receipt);
                    }

                    if (settings.resolveMethod === 'receipt') {
                        resolve(receipt);
                    }
                })
                .on('confirmation', (confNumber, receipt) => {
                    console.log(confNumber, receipt);
                    if (settings.onConfirmation) {
                        settings.onConfirmation(confNumber, receipt);
                    }

                    if (settings.resolveMethod === 'confirmation') {
                        resolve(confNumber, receipt);
                    }
                })
                .on('error', error => {
                    console.log(error);
                    reject(error);
                })
                .then(receipt => {
                    // will be fired once the receipt is mined
                    console.log(receipt);
                    if (settings.onMined) {
                        settings.onMined(receipt);
                    }

                    if (settings.resolveMethod === 'mined') {
                        resolve(receipt);
                    }
                });
        }));
    }
}
