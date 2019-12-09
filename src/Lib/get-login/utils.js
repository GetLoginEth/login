import {CODE_INCORRECT_DATA, LoginError} from "./login-error";

export const INVITE_LENGTH = 32;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 3;
export const PASSWORD_MAX_LENGTH = 300;

export const LOGIN_WEB3 = 'login_web3';
export const LOGIN_TREZOR = 'login_trezor';

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const getUsernameHash = async (username) => {
    // todo implement
    return 'hash_of_' + username;
};

export const isUsernameRegistered = async (username) => {
    // todo implement
    const usernameHash = await getUsernameHash(username);
    return usernameHash ? username === 'admin' : false;
};

export const decodeWallet = async (wallet, password) => {
    // todo implement
    await validateWallet(wallet);
    await validatePassword(password);

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

export const validateWallet = (data) => {
    if (typeof data !== 'object') {
        throw new LoginError(CODE_INCORRECT_DATA);
    }

    /*if(data.hasAttribute('---')){

    }*/

    return true;
};
