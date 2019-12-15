import {CODE_INCORRECT_DATA, CODE_BALANCE_ZERO_OR_LESS, LoginError} from "./login-error";

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

export const getUsernameHash = async (web3, username) => {
    username = filterUsername(username);

    return web3.utils.sha3(username);
};

export const isUsernameRegistered = async (web3, username) => {
    // todo implement
    const usernameHash = await getUsernameHash(web3, username);
    return usernameHash ? username === 'admin' : false;
};

export const createEncodedWallet = async (web3, password) => {
    await validatePassword(password);

    // todo check encrypt mode with user password
    return web3.eth.accounts.create().encrypt(password);
};

export const decodeWallet = async (wallet, password) => {
    // todo implement
    await validateWallet(wallet);
    await validatePassword(password);

    return true;
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
