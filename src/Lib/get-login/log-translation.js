import {
    LOG_SIGN_UP_BZZ_APPROVE, LOG_SIGN_UP_BZZ_TRANSFER,
    LOG_SIGN_UP_CHECK_FUNDS,
    LOG_SIGN_UP_CHECK_USERNAME,
    LOG_SIGN_UP_CREATE_NEW_WALLET,
    LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE,
    LOG_SIGN_UP_USER_REGISTRATION
} from "./signup";
import {
    LOG_LOG_IN_CHECK_PASSWORD,
    LOG_LOG_IN_CHECK_USERNAME,
    LOG_LOG_IN_CHECK_WALLET,
    LOG_LOG_IN_DECODE_WALLET,
    LOG_LOG_IN_RECEIVE_WALLET
} from "./signin";
import {SESSION_CREATE_WALLET, SESSION_REGISTER_WALLET} from "./session";
import {LOG_CHANGE_PASSWORD, LOG_CREATE_NEW_WALLET} from "./changePassword";

export const translation = {
    [LOG_SIGN_UP_CHECK_FUNDS]: 'Check funds',
    [LOG_SIGN_UP_CHECK_USERNAME]: 'Check username',
    [LOG_SIGN_UP_CREATE_WALLET_FROM_INVITE]: 'Create wallet from invite',
    [LOG_SIGN_UP_CREATE_NEW_WALLET]: 'Create new wallet',
    [LOG_SIGN_UP_USER_REGISTRATION]: 'User registration',
    [LOG_LOG_IN_CHECK_USERNAME]: 'Check username',
    [LOG_LOG_IN_RECEIVE_WALLET]: 'Receive wallet',
    [LOG_LOG_IN_CHECK_WALLET]: 'Check wallet',
    [LOG_LOG_IN_DECODE_WALLET]: 'Decode wallet',
    [LOG_LOG_IN_CHECK_PASSWORD]: 'Check password',
    [SESSION_CREATE_WALLET]: 'Generating new session',
    [SESSION_REGISTER_WALLET]: 'Storing session in blockchain',
    [LOG_CHANGE_PASSWORD]: 'Change password',
    [LOG_CREATE_NEW_WALLET]: 'Create new wallet',
    [LOG_SIGN_UP_BZZ_APPROVE]: 'BZZ preparing',
    [LOG_SIGN_UP_BZZ_TRANSFER]: 'BZZ transfer',
};

export const translate = (message) => {
    console.log(message, translation[message]);
    return translation[message] ? translation[message] : message;
};
