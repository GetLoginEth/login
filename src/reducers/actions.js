import {
    ACTION_ALLOW_APP,
    ACTION_APP_INFO, ACTION_CHANGE_PASSWORD,
    ACTION_CREATE_INVITE,
    ACTION_CREATE_MY_APP,
    ACTION_DELETE_MY_APP, ACTION_EDIT_MY_APP,
    ACTION_GET_SESSION_APP,
    ACTION_GET_BALANCE,
    ACTION_GET_INVITE,
    ACTION_GET_INVITES, ACTION_GET_LOGIC_CONTRACT,
    ACTION_GET_MY_APPS,
    ACTION_GET_MY_APPS_INFO, ACTION_GET_MY_SESSIONS, ACTION_GET_SETTINGS, ACTION_GET_TREZOR_ADDRESSES,
    ACTION_INVITE, ACTION_GET_INVITE_INFO,
    ACTION_LOCAL_AUTH,
    ACTION_LOGOUT,
    ACTION_RESTORE_MY_APP,
    ACTION_SELF_APP_INFO,
    ACTION_SESSION, ACTION_SET_INVITE_RESET,
    ACTION_SIGNIN,
    ACTION_SIGNUP,
    getStatus,
    STATUS_COMPLETE,
    STATUS_FAIL,
    STATUS_INIT,
    STATUS_LOG,
    STATUS_MINED,
    STATUS_START,
    STATUS_SUCCESS, ACTION_RESET_PASSWORD, ACTION_CLOSE_SESSION
} from "./mainReducer";
import Signup, {SIGN_UP_INVITE} from "../Lib/get-login/signup";
import Signin, {LOGIN_DATA, LOGIN_USERNAME_PASSWORD, LOGIN_WEB3_PROVIDER} from "../Lib/get-login/signin";
import {CODE_EMPTY_METHOD_PARAM, LoginError} from "../Lib/get-login/login-error";
import {translate} from "../Lib/get-login/log-translation";
import {getUsernameHash, LOGIN_TREZOR, validateUserData} from "../Lib/get-login/utils";
import crypto from "../Lib/get-login/crypto";
import contract, {defaultAddresses} from "../Lib/get-login/contract";
import Invite from "../Lib/get-login/invite";
import Session from "../Lib/get-login/session";
/*import TrezorConnect from 'trezor-connect';*/
import TrezorConnect from "../Lib/get-login/crypto";
import ChangePassword from "../Lib/get-login/changePassword";

/*TrezorConnect.manifest({
    email: 'igor.shadurin@gmail.com',
    appUrl: 'https//swarm-gateways.net/bzz:/getlogin.eth'
});*/

const currentNetwork = 'rinkeby';
const smartContractAddress = defaultAddresses[currentNetwork];
let cryptoInstance = crypto.getInstance();
let contractInstance = new contract(cryptoInstance.web3, currentNetwork, smartContractAddress);
let dispatch = null;
/**
 *
 * @type Signup
 */
let signup = null;
/**
 *
 * @type {Signin}
 */
let signin = null;
/**
 *
 * @type {ChangePassword}
 */
let password = null;
/**
 *
 * @type Session
 */
let session = null;
/**
 *
 * @type Invite
 */
let invite = null;

export const web3 = cryptoInstance.web3;

export const doDispatch = (type, data = {}, startData = {}) => {
    dispatch({type, data, startData});
};

export const init = (dispatch) => {
    const getLogger = (action) => {
        return {
            log: (type, data) => {
                console.log(type, data);
                const message = translate(type);
                console.log(message);
                doDispatch(getStatus(action, STATUS_LOG), message);
            }
        };
    };
    setDispatch(dispatch);
    // todo move init to lib class?
    signup = new Signup(cryptoInstance, contractInstance);
    signin = new Signin(cryptoInstance, contractInstance);
    invite = new Invite(cryptoInstance, contractInstance);
    session = new Session(cryptoInstance, contractInstance);
    password = new ChangePassword(cryptoInstance, contractInstance, session, invite);
    signup.setLogger(getLogger(ACTION_SIGNUP));
    signin.setLogger(getLogger(ACTION_SIGNIN));
    invite.setLogger(getLogger(ACTION_INVITE));
    session.setLogger(getLogger(ACTION_SESSION));
    password.setLogger(getLogger(ACTION_CHANGE_PASSWORD));
    checkLocalCredentials().then();
    doDispatch(getStatus(ACTION_SELF_APP_INFO, STATUS_INIT), {
        network: currentNetwork,
        smartContractAddress,
        provider: cryptoInstance.config.websocketProviderUrl
    });
};

export const checkLocalCredentials = async () => {
    return callMethod(ACTION_LOCAL_AUTH, async () => {
        const data = getUserData();
        await validateUserData(data);
        let address;
        if (data.type === LOGIN_TREZOR) {
            const publicKey = localStorage.getItem('public_key');
            const addressIndex = localStorage.getItem('address_index');
            const path = `m/44'/60'/0'/0/${addressIndex}`;
            if (publicKey) {
                cryptoInstance.setPublicKey(publicKey);
            } else {
                throw new Error('Public key not found');
            }

            address = data.address;
            contractInstance.setExternalSign(async transaction => {
                //console.log('External called');
                //console.log(transaction);
                const result = await TrezorConnect.ethereumSignTransaction({
                    path,
                    transaction
                });
                //console.log(result);
                if (!result.success) {
                    throw new LoginError(result.payload.error);
                }

                return result.payload;
            }, address);
        } else {
            await contractInstance.setPrivateKey(data.wallet.privateKey);
            cryptoInstance.setAccount(data.wallet.privateKey);
            address = data.wallet.address;
        }

        getWalletBalance(address).then();
        setInterval(_ => {
            try {
                getWalletBalance(getLocalAddress()).then();
            } catch (e) {

            }
        }, 10000);
        const redirectUrl = window.sessionStorage.getItem('redirect_url');
        if (redirectUrl) {
            window.location.replace(redirectUrl);
            window.sessionStorage.removeItem('redirect_url')
        }

        return data;
    });
};

export const getWalletBalance = async (wallet) => {
    return callMethod(ACTION_GET_BALANCE, async () => cryptoInstance.web3.eth.getBalance(wallet)
        .then(data => {
            const original = cryptoInstance.web3.utils.fromWei(data);
            // todo fix situation when 3.65898484 displays as 3.66
            const web = Number(original).toFixed(2);
            return {
                original,
                web
            };
        }), wallet);
};

export const setDispatch = (newDispatch) => {
    dispatch = newDispatch;
};

export const getDispatch = () => {
    return dispatch;
};

export const signIn = async (method, username, password, wallet, options = {}) => {
    // todo reset all state because new user
    return callMethod(ACTION_SIGNIN, async () => {
        const usernameHash = getUsernameHash(cryptoInstance.web3, username);
        const receivedWallet = await signin.signIn(method, username, password, wallet, options);
        /*if (method === LOGIN_DATA) {
            setUserData(username, wallet, LOGIN_DATA);
        } else */
        if (method === LOGIN_USERNAME_PASSWORD) {
            setUserData(username, receivedWallet, LOGIN_USERNAME_PASSWORD);
        } else if (method === LOGIN_WEB3_PROVIDER) {
            setUserData(username, receivedWallet, LOGIN_WEB3_PROVIDER);
        } else if (method === LOGIN_TREZOR) {
            setUserData(username, null, LOGIN_TREZOR, options.address);
        } else {
            throw new Error('Not supported method for local storing');
        }

        return {username, usernameHash};
    })
        .then(() => checkLocalCredentials());
};

export const signUp = async (method, username, password = '', invite = '', options = {}) => {
    /** @type {IInviteRegistration} */
    const result = await callMethod(ACTION_SIGNUP, async () => {
        return await signup.signUp(method, username, password, invite, info => {
            doDispatch(getStatus(ACTION_SIGNUP, STATUS_MINED), info);
        }, options);
    });

    if (result && [SIGN_UP_INVITE/*, LOGIN_WEB3, LOGIN_TREZOR*/].includes(method)) {
        if (method === SIGN_UP_INVITE) {
            method = LOGIN_DATA;
        }

        setUserData(username, result.decryptedWallet, method);
    } else if (result && method === LOGIN_TREZOR) {
        setUserData(username, null, LOGIN_TREZOR, options.address);
    }

    await checkLocalCredentials();

    return result;
};

export const logoutLocal = () => {
    return callMethod(ACTION_LOGOUT, async () => {
        localStorage.clear();
        return true;
    });
};

export const appLogoutLocal = (appId) => {
    return callMethod(ACTION_LOGOUT, async () => {
        //localStorage.clear();
        const data = getAllAccessTokens();
        delete data[appId];
        saveAllAccessTokens(data);
        return true;
    }, {appId});
};

/**
 *
 * @param username
 * @param wallet
 * @param type
 * @param address - for Hard wallets
 * @returns {boolean}
 */
export const setUserData = (username, wallet, type, address) => {
    if (username) {
        localStorage.setItem('username', username);
        localStorage.setItem('usernameHash', getUsernameHash(cryptoInstance.web3, username));
    } else {
        localStorage.removeItem('username');
        localStorage.removeItem('usernameHash');
    }

    if (wallet) {
        if (typeof wallet === 'object') {
            wallet = JSON.stringify(wallet);
        }

        localStorage.setItem('wallet', wallet);
    } else {
        localStorage.removeItem('wallet');
    }

    if (type) {
        localStorage.setItem('type', type);
    } else {
        localStorage.removeItem('type');
    }

    if (address) {
        localStorage.setItem('address', address);
    } else {
        localStorage.removeItem('address');
    }

    return true;
};

export const getUserData = () => {
    const username = localStorage.getItem('username');
    const wallet = JSON.parse(localStorage.getItem('wallet'));
    const usernameHash = localStorage.getItem('usernameHash');
    const type = localStorage.getItem('type');
    const address = localStorage.getItem('address');

    return {username, wallet, usernameHash, type, address};
};

export const getLocalUsernameHash = () => {
    return getUserData()['usernameHash'];
};

export const getLocalUsername = () => {
    return getUserData()['username'];
};

export const getLocalAddress = () => {
    return getUserData().wallet.address;
};

export const getLocalType = () => {
    return getUserData()['type'];
};

export const initPage = (pageAction) => {
    doDispatch(getStatus(pageAction, STATUS_INIT));
};

export const getAppInfo = async (appId) => {
    return callMethod(ACTION_APP_INFO, async () => await contractInstance.getApplication(appId), appId);
};

export const getAppsInfo = async (appIds) => {
    return callMethod(ACTION_GET_MY_APPS_INFO, async () => {
        let result = {};
        for (const appId of appIds) {
            result[appId] = await contractInstance.getApplication(appId);
        }

        return result;
    }, appIds);
};

export const allowApp = async (appId) => {
    return await callMethod(ACTION_ALLOW_APP, async () => {
        const sessionInfo = await session.createSession(appId);

        return setRawAccessToken(appId, {
            transactionHash: sessionInfo.createdSession,
            privateKey: sessionInfo.wallet.privateKey
        });
    }, {appId});
};

export const getAppSession = async (appId) => {
    return callMethod(ACTION_GET_SESSION_APP, async () => {
        if (!appId) {
            throw new Error('Empty appId');
        }

        const usernameHash = getLocalUsernameHash();
        if (!usernameHash) {
            throw new Error('Empty username');
        }

        const appToken = getAccessToken(appId);
        if (appToken) {
            return appToken;
        } else {
            const sessionInfo = await session.getSessionInfo(appId, usernameHash);

            return setRawAccessToken(appId, sessionInfo);
        }
    }, {appId});
};

const accessTokenKey = 'allowed_apps';
const getAccessToken = (appId) => {
    const data = getAllAccessTokens()[appId];
    if (!data) {
        return null;
    }

    return typeof data === 'string' ? JSON.parse(data) : data;
};

const setRawAccessToken = (appId, rawTokenInfo) => {
    const allTokens = getAllAccessTokens();
    allTokens[appId] = {
        privateKey: rawTokenInfo.privateKey,
        transactionHash: rawTokenInfo.transactionHash
    };
    saveAllAccessTokens(allTokens);

    return getAccessToken(appId);
};

const deleteAccessToken = (appId) => {
    const allTokens = getAllAccessTokens();
    delete allTokens[appId];
    saveAllAccessTokens(allTokens);

    return true;
};

const getAllAccessTokens = () => {
    let allowedApps = localStorage.getItem(accessTokenKey);
    if (typeof allowedApps !== 'string') {
        allowedApps = '{}';
    }

    allowedApps = JSON.parse(allowedApps);
    if (typeof allowedApps !== 'object') {
        allowedApps = {};
    }

    return allowedApps;
};

const saveAllAccessTokens = (data) => {
    localStorage.setItem(accessTokenKey, JSON.stringify(data));
};

export const getInvites = async (usernameHash) => {
    return callMethod(ACTION_GET_INVITES, async () => await contractInstance.getInvites(usernameHash));
};

export const getInvite = async (address) => {
    return callMethod(ACTION_GET_INVITE, async () => await contractInstance.getInvite(address));
};

export const createInvite = async () => {
    return callMethod(ACTION_CREATE_INVITE, async () => await invite.createInvite());
};

export const changePassword = async (username, oldPassword, newPassword) => {
    return callMethod(ACTION_CHANGE_PASSWORD, async () => {
        const data = await password.changePassword(username, oldPassword, newPassword);
        setUserData(getLocalUsername(), data.wallet, LOGIN_DATA);
        await callMethod(ACTION_LOCAL_AUTH, async () => getUserData(), {isQuiet: true});

        return data;
    });
};

/*export const getApps = async (usernameHash) => {
    return callMethod(ACTION_GET_MY_APPS, async () => await contractInstance.getApps(usernameHash));
};*/

export const getMyApps = async () => {
    return callMethod(ACTION_GET_MY_APPS, async () => await contractInstance.getApps(getLocalUsernameHash()));
};

export const createApplication = async (title, description, allowedUrls = [], allowedContracts = []) => {
    return callMethod(ACTION_CREATE_MY_APP, async () => await contractInstance.createApplication(title, description, allowedUrls, allowedContracts));
};

export const editApplication = async (id, title, description, allowedUrls = [], allowedContracts = []) => {
    return callMethod(ACTION_EDIT_MY_APP, async () => await contractInstance.editApplication(id, title, description, allowedUrls, allowedContracts));
};

export const deleteApplication = async (id) => {
    return callMethod(ACTION_DELETE_MY_APP, async () => await contractInstance.deleteApplication(id));
};

export const restoreApplication = async (id) => {
    return callMethod(ACTION_RESTORE_MY_APP, async () => await contractInstance.restoreApplication(id));
};

export const getMySessions = async () => {
    return callMethod(ACTION_GET_MY_SESSIONS, async () => await contractInstance.getActiveSessions(getLocalUsernameHash()));
};

export const getTrezorAddresses = async () => {
    return callMethod(ACTION_GET_TREZOR_ADDRESSES, async () => {
        const result = await signup.getTrezorInfo();
        localStorage.setItem('public_key', result.publicKey);
        /*console.log(result);
        cryptoInstance.setPublicKey(result.publicKey);
        console.log(cryptoInstance);*/
        return result;
    });
};

export const setAddressIndex = (index) => {
    localStorage.setItem('address_index', index);
};

export const getLogicContractAddress = async () => {
    return callMethod(ACTION_GET_LOGIC_CONTRACT, async () => {
        return await contractInstance.getLogicContractAddress();
    });
};

export const getAllSettings = async (usernameHash) => {
    return callMethod(ACTION_GET_SETTINGS, async () => {
        return await contractInstance.getAllSettings(usernameHash);
    });
};

export const setInviteReset = async (allow) => {
    return callMethod(ACTION_SET_INVITE_RESET, async () => {
        await contractInstance.setInviteReset(allow);

        return allow;
    });
};

export const getInviteInfo = async (invitePrivateKey) => {
    return callMethod(ACTION_GET_INVITE_INFO, async () => {
        return await invite.getInviteInfo(invitePrivateKey, password);
    });
};

export const closeSession = async (appId, logId) => {
    return callMethod(ACTION_CLOSE_SESSION, async () => {
        const usernameHash = getLocalUsernameHash();
        deleteAccessToken(appId);
        return await session.closeSession(appId, usernameHash, getLocalAddress());
    }, {appId, logId});
};

export const resetPassword = async (invite, username, newPassword) => {
    return callMethod(ACTION_RESET_PASSWORD, async () => {
        const data = await password.resetPasswordByInvite(invite, username, newPassword);
        setUserData(username, data.wallet, LOGIN_DATA);
        await callMethod(ACTION_LOCAL_AUTH, async () => getUserData());
    });
};

export const test = async () => {
    return callMethod('my_test', async () => {

    });
};

export const callMethod = async (actionName, func, startData = null) => {
    let result = null;
    try {
        doDispatch(getStatus(actionName, STATUS_START), startData);
        if (!func) {
            throw new LoginError(CODE_EMPTY_METHOD_PARAM);
        }

        result = await func();
        doDispatch(getStatus(actionName, STATUS_SUCCESS), result, startData);
    } catch (error) {
        // todo not log error, but pass correct filenames to dispatch
        console.log(error);
        doDispatch(getStatus(actionName, STATUS_FAIL), error);
    }

    doDispatch(getStatus(actionName, STATUS_COMPLETE));

    return result;
};
