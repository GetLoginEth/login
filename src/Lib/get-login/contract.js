export const defaultAddresses = {
    "rinkeby": "0x107A572Cd04eB7F54a47EbDDB19633671DB11366",
    "mainnet": ""
};

export const defaultAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "creatorUsername",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            }
        ],
        "name": "EventAppCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "username",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "iv",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "ephemPublicKey",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "ciphertext",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "mac",
                "type": "string"
            }
        ],
        "name": "EventAppSession",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "creatorUsername",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "inviteAddress",
                "type": "address"
            }
        ],
        "name": "EventInviteCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "username",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "walletAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "ciphertext",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "iv",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "salt",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "mac",
                "type": "string"
            }
        ],
        "name": "EventStoreWallet",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "name": "Applications",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "id",
                "type": "uint64"
            },
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "Invites",
        "outputs": [
            {
                "internalType": "address",
                "name": "inviteAddress",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "creatorUsername",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "registeredUsername",
                "type": "bytes32"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "UserSessions",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "username",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            },
            {
                "internalType": "uint8",
                "name": "sessionType",
                "type": "uint8"
            },
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "Users",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "username",
                "type": "bytes32"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "UsersAddressUsername",
        "outputs": [
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "bytes32",
                "name": "username",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "addApplicationContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "url",
                "type": "string"
            }
        ],
        "name": "addApplicationUrl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "applicationId",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "address payable",
                "name": "wallet",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "iv",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "ephemPublicKey",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "ciphertext",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "mac",
                "type": "string"
            }
        ],
        "name": "createAppSession",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "allowedUrls",
                "type": "string[]"
            },
            {
                "internalType": "address[]",
                "name": "allowedContracts",
                "type": "address[]"
            }
        ],
        "name": "createApplication",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "inviteAddress",
                "type": "address"
            }
        ],
        "name": "createInvite",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            }
        ],
        "name": "createUser",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "address payable",
                "name": "walletAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "ciphertext",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "iv",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "salt",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "mac",
                "type": "string"
            }
        ],
        "name": "createUserFromInvite",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            }
        ],
        "name": "deleteApplication",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "deleteApplicationContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "deleteApplicationUrl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string[]",
                "name": "allowedUrls",
                "type": "string[]"
            },
            {
                "internalType": "address[]",
                "name": "allowedContracts",
                "type": "address[]"
            }
        ],
        "name": "editApplication",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "id",
                "type": "uint64"
            }
        ],
        "name": "getAnyApplication",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "id",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "usernameHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "allowedUrls",
                        "type": "string[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "allowedContracts",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct GetLogin.Application",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "id",
                "type": "uint64"
            }
        ],
        "name": "getApplication",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "id",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "usernameHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string[]",
                        "name": "allowedUrls",
                        "type": "string[]"
                    },
                    {
                        "internalType": "address[]",
                        "name": "allowedContracts",
                        "type": "address[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct GetLogin.Application",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "getInvite",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "inviteAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "creatorUsername",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "registeredUsername",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct GetLogin.InviteInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "getUserByAddress",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "username",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct GetLogin.UserInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            }
        ],
        "name": "getUserInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "username",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct GetLogin.UserInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "getUsernameByAddress",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "isActiveInvite",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "isAddressRegistered",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appIp",
                "type": "uint64"
            },
            {
                "internalType": "address",
                "name": "checkAddress",
                "type": "address"
            }
        ],
        "name": "isAppOwner",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            }
        ],
        "name": "isUsernameExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            }
        ],
        "name": "restoreApplication",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "validateAddressRegistered",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            }
        ],
        "name": "validateAppExists",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "appId",
                "type": "uint64"
            },
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "validateAppOwner",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "validateInviteActive",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "validateInviteAvailable",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    }
];

export default class contract {
    constructor(web3, network = 'rinkeby', contractAddress, abi = defaultAbi) {
        /**
         *
         * @type {Web3}
         */
        this.web3 = web3;
        this.network = network;
        this.contractAddress = contractAddress;
        this.abi = abi;
        this.contract = null;
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
        this.contract = null;
        this.sendTxDefault = {
            balanceEther: '0',
            isForceSend: false,
            isNormalizeSendEther: false,
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
    }

    initContract() {
        this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress, {from: (this.account ? this.account.address : null)});
    }

    getContract() {
        if (!this.abi || !this.contractAddress) {
            throw new Error('Some params not filled');
        }

        if (!this.contract || (!this.contract.options.from && this.account && this.account.address)) {
            this.initContract();
        }

        return this.contract;
    }

    /*async sendTransaction(transaction) {
        const signedTx = await this.account.signTransaction(transaction);
        const result = await this.web3.eth.sendSignedTransaction(signedTx);

        return result;
    }*/

    /**
     *
     * @param privateKey
     */
    setPrivateKey(privateKey) {
        if (!privateKey) {
            throw new Error('Incorrect private key');
        }

        if (privateKey.indexOf('0x') === -1) {
            privateKey = '0x' + privateKey;
        }

        this.privateKey = privateKey;
        this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.initContract();
    }

    async callMethod(methodName, ...params) {
        return this.getContract().methods[methodName](...params).call();
    }

    async sendTx(methodName, settings = null, ...params) {
        if (settings) {
            settings = {...this.sendTxDefault, ...settings};
        } else {
            settings = this.sendTxDefault;
        }

        if (typeof settings.balanceEther !== 'string') {
            throw new Error('Required string for balanceEther');
        }

        if (settings.balanceEther === 'all') {
            settings.balanceEther = await this.web3.eth.getBalance(this.account.address);
            settings.balanceEther = this.web3.utils.fromWei(settings.balanceEther);
            settings.isNormalizeSendEther = true;
        }

        const data = this.getContract().methods[methodName](...params).encodeABI();
        //console.log(data);
        /**
         *
         * @type {{data: string, from: string, to: *, value: BN}}
         */
        let result = {
            from: this.account.address,
            to: this.contractAddress,
            value: this.web3.utils.toWei(settings.balanceEther, 'ether'),
            data
        };
        //console.log(result);
        const gasPrice = await this.web3.eth.getGasPrice();
        console.log('gasPrice', gasPrice);
        const gasPriceBN = this.web3.utils.toBN(gasPrice);
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
        estimateGas = Math.round(estimateGas + estimateGas);
        console.log('estimateGas', estimateGas);
        /**
         *
         * @type {BN}
         */
        const estimateGasBN = this.web3.utils.toBN(estimateGas);
        const totalGasBN = gasPriceBN.mul(estimateGasBN);
        if (settings.isNormalizeSendEther) {
            /**
             * @type {BN}
             */
            let resultValue = Number(settings.balanceEther) === 0 ? this.web3.utils.toBN(0) : this.web3.utils.toBN(result.value).sub(totalGasBN);
            if (resultValue && resultValue.isNeg()) {
                throw new Error('Too low balance');
            }

            result.value = resultValue;
        }

        result.gasLimit = estimateGas;
        result.gasPrice = gasPrice;
        result.nonce = await this.web3.eth.getTransactionCount(this.account.address);
        /**
         *
         * @type {SignedTransaction}
         */
        const signed = await this.web3.eth.accounts.signTransaction(result, this.account.privateKey);
        /*let sendResult = null;
        try {
            sendResult = this.web3.eth.sendSignedTransaction(signed.rawTransaction);
        } catch (e) {
            console.error(e);
        }*/

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
        return this.callMethod('getUserInfo', usernameHash);
    }

    async createUser(usernameHash) {
        return this.sendTx('createUser', this.sendTxDefault, usernameHash);
    }

    async createApplication(title, description, allowedUrls = [], allowedContracts = []) {
        return this.sendTx('createApplication', this.sendTxDefault, title, description, allowedUrls, allowedContracts);
    }

    async editApplication(id, title, description, allowedUrls = [], allowedContracts = []) {
        return this.sendTx('editApplication', this.sendTxDefault, id, title, description, allowedUrls, allowedContracts);
    }

    async deleteApplication(id) {
        return this.sendTx('deleteApplication', this.sendTxDefault, id);
    }

    async restoreApplication(id) {
        return this.sendTx('restoreApplication', this.sendTxDefault, id);
    }

    async createUserFromInvite(usernameHash, walletAddress, ciphertext, iv, salt, mac) {
        // todo check send tx only from invited address
        let params = {...this.sendTxDefault};
        params.balanceEther = 'all';

        return this.sendTx('createUserFromInvite', params, usernameHash, walletAddress, ciphertext, iv, salt, mac);
    }

    async findWalletInLogs(usernameHash) {
        const results = await this.getContract().getPastEvents('EventStoreWallet', {
            filter: {
                username: usernameHash,
            },
            fromBlock: 0
        });

        return results && results.length ? results[0] : null;
    }

    async getApplication(appId) {
        appId = Number(appId);
        if (!appId || isNaN(appId) || appId <= 0) {
            throw new Error('Incorrect appId');
        }

        const info = await this.callMethod('getApplication', appId);
        if (appId !== Number(info.id)) {
            throw new Error('App not found');
        }

        return info;
    }

    async getAnyApplication(appId) {
        appId = Number(appId);
        if (!appId || isNaN(appId) || appId <= 0) {
            throw new Error('Incorrect appId');
        }

        const info = await this.callMethod('getAnyApplication', appId);
        if (appId !== Number(info.id)) {
            throw new Error('App not found');
        }

        return info;
    }

    async isInviteExists(inviteAddress) {
        const info = await this.callMethod('Invites', inviteAddress);

        return info && info.isActive;
    }

    async getInvite(inviteAddress) {
        return await this.callMethod('Invites', inviteAddress);
    }

    async getInvites(usernameHash) {
        return await this.getContract().getPastEvents('EventInviteCreated', {
            filter: {
                creatorUsername: usernameHash,
            },
            fromBlock: 0
        });
    }

    async getApps(usernameHash) {
        return await this.getContract().getPastEvents('EventAppCreated', {
            filter: {
                creatorUsername: usernameHash,
            },
            fromBlock: 0
        });
    }

    async createInvite(wallet, balanceEther) {
        return this.sendTx('createInvite', {...this.sendTxDefault, balanceEther}, wallet);
    }

    async createAppSession(appId, address, iv, ephemPublicKey, ciphertext, mac, balanceEther) {
        return this.sendTx('createAppSession', {
            ...this.sendTxDefault,
            balanceEther
        }, appId, address, iv, ephemPublicKey, ciphertext, mac);
    }

    async getSession(appId, username) {
        const results = await this.getContract().getPastEvents('EventAppSession', {
            filter: {
                appId,
                username,
            },
            fromBlock: 0
        });

        return results && results.length ? results[0] : null;
    }

    async getSessions(username) {
        return await this.getContract().getPastEvents('EventAppSession', {
            filter: {
                username,
            },
            fromBlock: 0
        });
    }
}
