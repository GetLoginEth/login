import {CODE_BALANCE_ZERO_OR_LESS, CODE_INCORRECT_DATA, LoginError} from "./login-error";

export const INVITE_LENGTH = 64;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 3;
export const PASSWORD_MAX_LENGTH = 300;

export const LOGIN_WEB3 = 'login_web3';
export const LOGIN_TREZOR = 'login_trezor';

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const filterUsername = (username) => {
    return username.trim().toLowerCase();
};

export const getUsernameHash = (web3, username) => {
    username = filterUsername(username);

    return web3.utils.keccak256(username);
};

export const isUsernameRegistered = async (contract, username) => {
    const usernameHash = await getUsernameHash(contract.web3, username);
    const result = await contract.getUserInfo(usernameHash);

    return result ? result.isActive : false;
};

/**
 *
 * @param web3
 * @returns {Account}
 */
export const createWallet = (web3) => {
    return web3.eth.accounts.create();
};

export const encryptWallet = (wallet, password) => {
    validatePassword(password);

    return wallet.encrypt(password);
};

export const decryptWallet = async (web3, walletV3Json, password) => {
    await validateWallet(walletV3Json);
    validatePassword(password);

    return web3.eth.accounts.decrypt(walletV3Json, password);
};

export const validateUserData = async (data) => {
    //await validateWallet(data.wallet);
    await validateUsername(data.username);

    return true;
};

export const validateLength = (data, type, minLength, maxLength) => {
    if (typeof data !== type) {
        throw new LoginError(CODE_INCORRECT_DATA);
    }

    if (data.length >= minLength && data.length <= maxLength) {

    } else {
        throw new LoginError(CODE_INCORRECT_DATA);
    }

    return true;
};

export const validateUsername = (data) => {
    return validateLength(data, 'string', USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH);
};

export const validatePassword = (data) => {
    return validateLength(data, 'string', PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH);
};

export const validateInvite = (data) => {
    return validateLength(data, 'string', INVITE_LENGTH, INVITE_LENGTH);
};

export const validateWallet = (data) => {
    if (!data || typeof data !== 'object') {
        throw new LoginError(CODE_INCORRECT_DATA);
    }

    /*if(data.hasAttribute('---')){

    }*/

    return true;
};

export const validateMoreThanZero = (data) => {
    if (data <= 0) {
        throw new LoginError(CODE_BALANCE_ZERO_OR_LESS);
    }

    return true;
};

export const uuidv4 = () => {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
};

export const dataToV3Wallet = data => {
    return {
        "version": 3,
        "id": uuidv4(),
        "address": data.returnValues.walletAddress,
        "crypto": {
            "kdf": "scrypt",
            "kdfparams": {
                "dklen": 32,
                "salt": data.returnValues.salt,
                "n": 8192,
                "r": 8,
                "p": 1
            },
            "cipher": "aes-128-ctr",
            "ciphertext": data.returnValues.ciphertext,
            "cipherparams": {
                "iv": data.returnValues.iv
            },
            "mac": data.returnValues.mac
        },
    };
};
