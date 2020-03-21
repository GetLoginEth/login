const ethereumjs = require('ethereumjs-tx').Transaction;

export const defaultAddresses = {
    "rinkeby": "0x36ABeeC598Ed9D080dCbAB4c0F5dB764187d5956",
    "mainnet": ""
};

export const defaultLogicAbi = [
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
        "inputs": [
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
            },
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "appId",
                        "type": "uint64"
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
                "internalType": "struct GetLoginLogic.SessionData[]",
                "name": "sessions",
                "type": "tuple[]"
            }
        ],
        "name": "changePassword",
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
        "inputs": [],
        "name": "init",
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
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "setOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract GetLoginStorage",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "setStorageAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract GetLoginStorage",
                "name": "_getLoginStorage",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
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
                "internalType": "struct GetLoginStorage.Application",
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
                "internalType": "struct GetLoginStorage.InviteInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getLoginStorage",
        "outputs": [
            {
                "internalType": "contract GetLoginStorage",
                "name": "",
                "type": "address"
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
                "internalType": "struct GetLoginStorage.UserInfo",
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
                "internalType": "struct GetLoginStorage.UserInfo",
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
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            }
        ],
        "name": "getUserSessions",
        "outputs": [
            {
                "components": [
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
                "internalType": "struct GetLoginStorage.UserSession[]",
                "name": "",
                "type": "tuple[]"
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
                "name": "appId",
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
                "internalType": "address",
                "name": "wallet",
                "type": "address"
            }
        ],
        "name": "isInviteAddressUsed",
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
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
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
        "name": "validateAddressAvailable",
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

        // method for external sign (trezor, web3 and etc)
        this.externalSign = null;
        this.externalAddress = null;
        this.storageAbi = [
            {
                "inputs": [
                    {
                        "internalType": "uint64",
                        "name": "id",
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
                        "name": "id",
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
                        "internalType": "bytes32",
                        "name": "creatorUsername",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "appId",
                        "type": "uint64"
                    }
                ],
                "name": "emitEventAppCreated",
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
                        "internalType": "bytes32",
                        "name": "username",
                        "type": "bytes32"
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
                "name": "emitEventAppSession",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "creatorUsername",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "address",
                        "name": "inviteAddress",
                        "type": "address"
                    }
                ],
                "name": "emitEventInviteCreated",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "bytes32",
                        "name": "username",
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
                "name": "emitEventStoreWallet",
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
                    },
                    {
                        "internalType": "address",
                        "name": "wallet",
                        "type": "address"
                    }
                ],
                "name": "pushApplicationContract",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
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
                "inputs": [],
                "name": "incrementApplicationId",
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
                    },
                    {
                        "internalType": "string",
                        "name": "url",
                        "type": "string"
                    }
                ],
                "name": "pushApplicationUrl",
                "outputs": [],
                "stateMutability": "nonpayable",
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
                "name": "pushUserSession",
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
                    },
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
                        "internalType": "struct GetLoginStorage.Application",
                        "name": "data",
                        "type": "tuple"
                    }
                ],
                "name": "setApplication",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_address",
                        "type": "address"
                    },
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
                        "internalType": "struct GetLoginStorage.InviteInfo",
                        "name": "data",
                        "type": "tuple"
                    }
                ],
                "name": "setInvite",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_address",
                        "type": "address"
                    }
                ],
                "name": "setLogicAddress",
                "outputs": [],
                "stateMutability": "nonpayable",
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
                        "internalType": "struct GetLoginStorage.UserInfo",
                        "name": "info",
                        "type": "tuple"
                    }
                ],
                "name": "setUser",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_address",
                        "type": "address"
                    },
                    {
                        "components": [
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
                        "internalType": "struct GetLoginStorage.Username",
                        "name": "info",
                        "type": "tuple"
                    }
                ],
                "name": "setUsersAddressUsername",
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
                        "internalType": "struct GetLoginStorage.Application",
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
                        "name": "_address",
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
                        "internalType": "struct GetLoginStorage.InviteInfo",
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
                "name": "getUser",
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
                        "internalType": "struct GetLoginStorage.UserInfo",
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
                        "name": "_address",
                        "type": "address"
                    }
                ],
                "name": "getUsersAddressUsername",
                "outputs": [
                    {
                        "components": [
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
                        "internalType": "struct GetLoginStorage.Username",
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
                "name": "getUserSessions",
                "outputs": [
                    {
                        "components": [
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
                        "internalType": "struct GetLoginStorage.UserSession[]",
                        "name": "",
                        "type": "tuple[]"
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
                "inputs": [],
                "name": "logicAddress",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "owner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
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
            }
        ];
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

    async sendTx(methodName, settings = null, ...params) {
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
            settings.isNormalizeSendEther = true;
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
        result.nonce = await this.web3.eth.getTransactionCount(accountAddress);
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
}
