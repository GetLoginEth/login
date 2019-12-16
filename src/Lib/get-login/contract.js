export const defaultAddresses = {
    "rinkeby": "0x47BDA210deAC5446118BB35cd7c29365Ed38bB3B",
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
                "internalType": "address payable",
                "name": "inviteAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "creatorUsername",
                "type": "string"
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
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
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
                "internalType": "string",
                "name": "creatorUsername",
                "type": "string"
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

    getContract() {
        if (!this.abi || !this.contractAddress) {
            throw new Error('Some params not filled');
        }

        if (!this.contract || (!this.contract.options.from && this.account && this.account.address)) {
            this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress, {from: (this.account ? this.account.address : null)});
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

    async callMethod(methodName, ...params) {
        return this.getContract().methods[methodName](...params).call();
    }

    async getUserInfo(usernameHash) {
        return this.callMethod('getUserInfo', usernameHash);
    }
}
