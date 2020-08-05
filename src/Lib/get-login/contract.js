import GetLoginStorage from '../../smart/build/contracts/GetLoginStorage.out.json';
import GetLoginLogic from '../../smart/build/contracts/GetLoginLogic.out.json';

const ethereumjs = require('ethereumjs-tx').Transaction;

export const defaultLogicAbi = GetLoginLogic;

export default class contract {
    constructor(web3, network = 'rinkeby', storageContractAddress, abi = defaultLogicAbi) {
        /**
         *
         * @type {Web3}
         */
        this.web3 = web3;
        this.network = network;
        this.storageContractAddress = storageContractAddress;
        this.logicContractAddress = null;
        this.abi = abi;
        this.privateKey = null;
        /**
         *
         * @type {Account}
         */
        this.account = null;
        /**
         *
         * @type {Contract}
         */
        this.logicContract = null;
        this.storageContract = null;
        this.sendTxDefault = {
            balanceEther: '0',
            isForceSend: false,
            resolveMethod: 'transactionHash',
            // when validated and sent (fast)
            onTransactionHash: _ => {

            },
            //
            onReceipt: _ => {

            },
            // when new confirmation
            onConfirmation: _ => {

            },
            // when mined (slow)
            onMined: _ => {

            },
        };

        // method for external sign (trezor, web3 and etc)
        this.externalSign = null;
        this.externalAddress = null;
        this.storageAbi = GetLoginStorage;
    }

    async getLogicContractAddress() {
        if (!this.logicContractAddress) {
            const storageContract = new this.web3.eth.Contract(this.storageAbi, this.storageContractAddress);
            const logicAddress = await storageContract.methods.logicAddress().call();
            console.log('logicAddress', logicAddress);
            if (!logicAddress) {
                throw new Error("Logic contract not found");
            }

            this.logicContractAddress = logicAddress;
        }

        return this.logicContractAddress;
    }

    setExternalSign(func, address) {
        this.externalSign = func;
        this.externalAddress = address;
    }

    initContract() {
        if (this.logicContract) {
            return this.logicContract;
        } else {
            return this.getLogicContractAddress()
                .then(logicContractAddress => {
                    this.logicContract = new this.web3.eth.Contract(this.abi, logicContractAddress, {from: (this.account ? this.account.address : null)});
                    return this.logicContract;
                });
        }
    }

    async getLogicContract() {
        const logicContract = await this.getLogicContractAddress();
        if (!this.abi || !logicContract) {
            throw new Error('Some params not filled');
        }

        if (!this.logicContract || (!this.logicContract.options.from && this.account && this.account.address)) {
            await this.initContract();
        }

        return this.logicContract;
    }

    getStorageContract() {
        if (!this.storageContract) {
            this.storageContract = new this.web3.eth.Contract(this.storageAbi, this.storageContractAddress);

        }
        return this.storageContract;
    }

    /**
     *
     * @param privateKey
     */
    async setPrivateKey(privateKey) {
        if (!privateKey) {
            throw new Error('Incorrect private key');
        }

        if (privateKey.indexOf('0x') === -1) {
            privateKey = '0x' + privateKey;
        }

        this.privateKey = privateKey;
        this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        await this.initContract();
    }

    async callLogicMethod(methodName, ...params) {
        const logicContract = await this.getLogicContract();
        return logicContract.methods[methodName](...params).call();
    }

    async callStorageMethod(methodName, ...params) {
        const storageContract = await this.getStorageContract();
        return storageContract.methods[methodName](...params).call();
    }

    async prepareTx(methodName, settings = null, ...params) {
        const logicContractAddress = await this.getLogicContractAddress();
        const accountAddress = this.externalAddress ? this.externalAddress : this.account.address;
        if (settings) {
            settings = {...this.sendTxDefault, ...settings};
        } else {
            settings = this.sendTxDefault;
        }

        if (typeof settings.balanceEther !== 'string') {
            throw new Error('Required string for balanceEther');
        }

        if (settings.balanceEther === 'all') {
            settings.balanceEther = await this.web3.eth.getBalance(accountAddress);
            settings.balanceEther = this.web3.utils.fromWei(settings.balanceEther);
        }

        const logicContract = await this.getLogicContract();
        const data = logicContract.methods[methodName](...params).encodeABI();
        /**
         *
         * @type {{data: string, from: string, to: *, value: BN}}
         */
        let result = {
            from: accountAddress,
            to: logicContractAddress,
            value: this.web3.utils.toWei(settings.balanceEther, 'ether'),
            data
        };
        const gasPrice = await this.web3.eth.getGasPrice();
        result.gasPrice = gasPrice;
        console.log('gasPrice', gasPrice);

        return result;
    }

    async calculateEstimateGas(result, settings = {}) {
        const gasPriceBN = this.web3.utils.toBN(result.gasPrice);
        let estimateGas;
        if (settings.isForceSend) {
            try {
                estimateGas = await this.web3.eth.estimateGas(result);
            } catch (e) {
                estimateGas = 10000000;
            }
        } else {
            estimateGas = await this.web3.eth.estimateGas(result);
        }

        // additional gas +20%
        //estimateGas = Math.round(estimateGas + estimateGas * 0.2);
        //estimateGas = Math.round(estimateGas + estimateGas);
        console.log('estimateGas', estimateGas);
        /**
         *
         * @type {BN}
         */
        const estimateGasBN = this.web3.utils.toBN(estimateGas);
        const totalGasBN = gasPriceBN.mul(estimateGasBN);
        if (settings.balanceEther === 'all') {
            /**
             * @type {BN}
             */
            let resultValue = Number(settings.balanceEther) === 0 ? this.web3.utils.toBN(0) : this.web3.utils.toBN(result.value).sub(totalGasBN);
            if (resultValue && resultValue.isNeg()) {
                throw new Error('Too low balance');
            }

            result.value = resultValue;
        }

        // or you can use just "gas". Differences?
        result.gasLimit = estimateGas;

        //return result;
        return this.web3.utils.toBN(result.gasPrice).mul(estimateGasBN);
    }

    async sendTx(methodName, settings = null, ...params) {
        let result = await this.prepareTx(methodName, settings, ...params);
        await this.calculateEstimateGas(result, settings);

        return this.signAndSendTx(result, settings);
    }

    async signAndSendTx(result, settings) {
        result.nonce = await this.web3.eth.getTransactionCount(result.from);
        /**
         *
         * @type {SignedTransaction}
         */
        let signed;
        if (this.externalSign) {
            result.gasLimit = result.gasLimit.toString();
            result.nonce = result.nonce.toString();
            result.gasLimit = this.web3.utils.numberToHex(result.gasLimit);
            result.gasPrice = this.web3.utils.numberToHex(result.gasPrice);
            result.nonce = this.web3.utils.numberToHex(result.nonce);

            signed = await this.externalSign(result);
            result = {...result, ...signed};

            let ethtx = new ethereumjs(result, {chain: this.network});
            const serializedTx = ethtx.serialize();
            signed.rawTransaction = '0x' + serializedTx.toString('hex');
        } else {
            signed = await this.web3.eth.accounts.signTransaction(result, this.account.privateKey);
        }

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

    async getUserInfo(usernameHash) {
        return this.callLogicMethod('getUserInfo', usernameHash);
    }

    async createUser(usernameHash) {
        return this.sendTx('createUser', this.sendTxDefault, usernameHash);
    }

    async createApplication(title, description, allowedUrls = [], allowedContracts = []) {
        return this.sendTx('createApplication', this.sendTxDefault, title, description, allowedUrls, allowedContracts);
    }

    async editApplication(id, title, description, allowedUrls = [], allowedContracts = []) {
        return this.sendTx('editApplication',
            {...this.sendTxDefault, resolveMethod: 'mined'},
            id, title, description, allowedUrls, allowedContracts);
    }

    async deleteApplication(id) {
        return this.sendTx('deleteApplication', this.sendTxDefault, id);
    }

    async restoreApplication(id) {
        return this.sendTx('restoreApplication', this.sendTxDefault, id);
    }

    async createUserFromInvite(usernameHash, walletAddress, ciphertext, iv, salt, mac, allowReset) {
        let params = {...this.sendTxDefault};
        params.balanceEther = 'all';

        return this.sendTx('createUserFromInvite', params, usernameHash, walletAddress, ciphertext, iv, salt, mac, allowReset);
    }

    async findWalletInLogs(usernameHash) {
        const storageContract = await this.getStorageContract();
        const results = await storageContract.getPastEvents('EventStoreWallet', {
            filter: {
                username: usernameHash,
            },
            fromBlock: 0
        });

        return results && results.length ? results[results.length - 1] : null;
    }

    async getApplication(appId) {
        appId = Number(appId);
        if (!appId || isNaN(appId) || appId <= 0) {
            throw new Error('Incorrect appId');
        }

        const info = await this.callStorageMethod('getApplication', appId);
        if (appId !== Number(info.id)) {
            throw new Error('App not found');
        }

        return info;
    }

    async isInviteExists(inviteAddress) {
        const info = await this.callStorageMethod('Invites', inviteAddress);

        return info && info.isActive;
    }

    async getInvite(inviteAddress) {
        return await this.callStorageMethod('Invites', inviteAddress);
    }

    async getInvites(usernameHash) {
        const storageContract = await this.getStorageContract();
        return await storageContract.getPastEvents('EventInviteCreated', {
            filter: {
                creatorUsername: usernameHash,
            },
            fromBlock: 0
        });
    }

    async getApps(usernameHash) {
        const storageContract = this.getStorageContract();
        return await storageContract.getPastEvents('EventAppCreated', {
            filter: {
                creatorUsername: usernameHash,
            },
            fromBlock: 0
        });
    }

    async createInvites(wallets, balanceEther) {
        return this.sendTx('createInvite', {...this.sendTxDefault, balanceEther}, wallets);
    }

    async createAppSession(appId, address, iv, ephemPublicKey, ciphertext, mac, balanceEther) {
        return this.sendTx('createAppSession', {
            ...this.sendTxDefault,
            balanceEther
        }, appId, address, iv, ephemPublicKey, ciphertext, mac);
    }

    async createEmptyAppSession(appId) {
        return this.createAppSession(appId, '0x0000000000000000000000000000000000000000', '', '', '', '', '0');
    }

    async getSession(appId, username) {
        const storageContract = await this.getStorageContract();
        const results = await storageContract.getPastEvents('EventAppSession', {
            filter: {
                appId,
                username,
            },
            fromBlock: 0
        });

        return results && results.length ? results[results.length - 1] : null;
    }

    async getAllSessions(usernameHash) {
        const storageContract = await this.getStorageContract();
        return storageContract.getPastEvents('EventAppSession', {
            filter: {
                username: usernameHash,
            },
            fromBlock: 0
        });
    }

    async getActiveSessions(usernameHash) {
        const sessions = await this.getAllSessions(usernameHash);
        const result = {};
        sessions.forEach(item => {
            result[item.returnValues.appId] = item;
        });

        return Object.values(result);
    }

    async getUserSessions(usernameHash) {
        return await this.callLogicMethod('getUserSessions', usernameHash);
    }

    async getUserSession(usernameHash, wallet) {
        wallet = wallet.toLowerCase();
        const sessions = await this.getUserSessions(usernameHash);
        if (sessions && sessions.length > 0) {
            const result = sessions.find(item => item.wallet.toLowerCase() === wallet);
            if (!result) {
                throw new Error('Wallet not assigned for this user');
            }

            return result;
        } else {
            throw new Error('User has no sessions');
        }
    }

    async changePassword(balanceEther, walletAddress, ciphertext, iv, salt, mac, sessions = []) {
        return this.sendTx('changePassword', {
            ...this.sendTxDefault,
            balanceEther
        }, walletAddress, ciphertext, iv, salt, mac, sessions);
    }

    async resetPassword(balanceEther, walletAddress, ciphertext, iv, salt, mac) {
        return this.sendTx('resetPassword', {
            ...this.sendTxDefault,
            balanceEther
        }, walletAddress, ciphertext, iv, salt, mac);
    }

    async getAllSettings(usernameHash) {
        return await this.callLogicMethod('getAllSettings', usernameHash);
    }

    async getInviteReset(usernameHash) {
        return await this.callLogicMethod('getInviteReset', usernameHash);
    }

    async setInviteReset(allow) {
        return await this.sendTx('setInviteReset', {
            ...this.sendTxDefault
        }, allow.toString());
    }
}
