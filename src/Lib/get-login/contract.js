export const defaultAddresses = {
    "rinkeby": "0x0ba434B99C095bCCb791D514Df2F4893b0b4a8C9",
    "mainnet": ""
};

export const defaultAbi = [
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "addWallet",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
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
                "internalType": "bytes32",
                "name": "creatorUsername",
                "type": "bytes32"
            }
        ],
        "name": "createApplication",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address payable",
                "name": "inviteAddress",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "creatorUsername",
                "type": "bytes32"
            }
        ],
        "name": "createInvite",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            }
        ],
        "name": "createUser",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "address",
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
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
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
        "constant": true,
        "inputs": [],
        "name": "applicationId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "Applications",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
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
                "internalType": "bytes32",
                "name": "username",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
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
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
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
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
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
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
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
        "name": "UserWallets",
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
            }
        ],
        "payable": false,
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

    async sendTransaction(transaction) {
        const signedTx = await this.account.signTransaction(transaction);
        const result = await this.web3.eth.sendSignedTransaction(signedTx);

        return result;
    }

    /**
     *
     * @param privateKey
     */
    setPrivateKey(privateKey) {
        if (privateKey.indexOf('0x') === -1) {
            privateKey = '0x' + privateKey;
        }

        this.privateKey = privateKey;
        this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.initContract();
    }

    saveWalletToTransaction(username, wallet) {
        // todo check wallet structure && encoded or not
        // todo send transaction with encoded wallet and username to SC
    }

    async callMethod(methodName, ...params) {
        return this.getContract().methods[methodName](...params).call();
    }

    async sendTx(methodName, balanceEther, ...params) {
        if (typeof balanceEther !== 'string') {
            throw new Error('Wait string here');
        }

        const data = this.getContract().methods[methodName](...params).encodeABI();
        //console.log(data);
        let result = {
            from: this.account.address,
            to: this.contractAddress,
            value: this.web3.utils.toWei(balanceEther, 'ether'),
            data
        };

        const gasPrice = await this.web3.eth.getGasPrice();
        const gasPriceBN = this.web3.utils.toBN(gasPrice);
        let estimateGas = await this.web3.eth.estimateGas(result);
        // additional gas +20%
        estimateGas = Math.round(estimateGas + estimateGas * 0.2);
        const estimateGasBN = this.web3.utils.toBN(estimateGas);
        const totalGasBN = gasPriceBN.mul(estimateGasBN);
        /**
         * @type {BN}
         */
        let resultValue = Number(balanceEther) === 0 ? 0 : result.value.sub(totalGasBN);
        if (resultValue && resultValue.isNeg()) {
            throw new Error('Too low balance');
        }

        result.value = resultValue;
        result.gasLimit = estimateGas;
        result.gasPrice = gasPrice;
        result.nonce = await this.web3.eth.getTransactionCount(this.account.address);

        /**
         *
         * @type {SignedTransaction}
         */
        const signed = await this.web3.eth.accounts.signTransaction(result, this.account.privateKey);

        return this.web3.eth.sendSignedTransaction(signed.rawTransaction);
    }

    async getUserInfo(usernameHash) {
        return this.callMethod('getUserInfo', usernameHash);
    }

    async createUser(usernameHash) {
        return this.sendTx('createUser', '0', usernameHash);
    }

    async createUserFromInvite(usernameHash, walletAddress, ciphertext, iv, salt, mac) {
        return this.sendTx('createUserFromInvite', '0', usernameHash, walletAddress, ciphertext, iv, salt, mac);
    }

    async findWalletInLogs(usernameHash) {
        const results = this.getContract().getPastEvents("EventStoreWallet", {
            filter: {
                username: usernameHash,

            },
            fromBlock: 0
        });

        return results.length ? results[0] : null;
    }
}
