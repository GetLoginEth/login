import {CODE_INCORRECT_DATA, LoginError} from "./login-error";

export const INVITE_LENGTH = 32;
export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
export const PASSWORD_MIN_LENGTH = 3;
export const PASSWORD_MAX_LENGTH = 300;

export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

export const getUsernameHash = async (username) => {
    // todo implement
    return 'hash_of_' + username;
};

export const isUsernameRegistered = async (username) => {
    // todo implement
    const usernameHash = await this.getUsernameHash(username);
    return usernameHash ? username === 'admin' : false;
};

export const validateLength = async (data, type, minLength, maxLength) => {
    if (typeof data !== type) {
        throw new LoginError(CODE_INCORRECT_DATA);
    }

    if (data.length >= minLength && data.length <= maxLength) {

    } else {
        throw new LoginError(CODE_INCORRECT_DATA);
    }

    return true;
};

export const validateUsername = async (data) => {
    return await validateLength(data, 'string', USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH);
};

export const validatePassword = async (data) => {
    return await validateLength(data, 'string', PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH);
};

export default class Utils {

}
