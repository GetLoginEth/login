import {
    LOG_SIGN_UP_CHECK_FUNDS,
    LOG_SIGN_UP_CHECK_USERNAME,
    LOG_SIGN_UP_CREATE_NEW_WALLET,
    LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE, LOG_SIGN_UP_USER_REGISTRATION
} from "./signup";

export const translation = {
    [LOG_SIGN_UP_CHECK_FUNDS]: 'Check funds',
    [LOG_SIGN_UP_CHECK_USERNAME]: 'Check username',
    [LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE]: 'Create wallet from invite',
    [LOG_SIGN_UP_CREATE_NEW_WALLET]: 'Create new wallet',
    [LOG_SIGN_UP_USER_REGISTRATION]: 'User registration',
};
export const translate = (message) => {
    console.log(message,translation[message]);
    return translation[message] ? translation[message] : message;
};
