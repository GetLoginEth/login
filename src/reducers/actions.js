import {
    ACTION_LOCAL_AUTH,
    ACTION_LOGOUT,
    ACTION_SIGNIN,
    ACTION_SIGNUP,
    getStatus,
    STATUS_COMPLETE,
    STATUS_FAIL,
    STATUS_INIT,
    STATUS_LOG,
    STATUS_START,
    STATUS_SUCCESS
} from "./mainReducer";
import Signup, {SIGN_UP_INVITE} from "../Lib/get-login/signup";
import Signin, {LOGIN_DATA} from "../Lib/get-login/signin";
import {CODE_EMPTY_METHOD_PARAM, LoginError} from "../Lib/get-login/login-error";
import {translate} from "../Lib/get-login/log-translation";
import {validateUserData} from "../Lib/get-login/utils";

let dispatch = null;
let signup = null;
let signin = null;

export const doDispatch = (type, data = {}) => {
    dispatch({type, data});
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
    signup = new Signup();
    signin = new Signin();
    signup.setLogger(getLogger(ACTION_SIGNUP));
    signin.setLogger(getLogger(ACTION_SIGNIN));
    checkLocalCredentials().then();
};


export const checkLocalCredentials = async () => {
    return callMethod(ACTION_LOCAL_AUTH, async () => {
        const data = getUserData();
        await validateUserData(data);

        return true;
    });
};

export const setDispatch = (newDispatch) => {
    dispatch = newDispatch;
};

export const getDispatch = () => {
    return dispatch;
};

export const signIn = async (method, ...data) => {
    // todo display errors
    return callMethod(ACTION_SIGNIN, async () => {
        return await signin.signIn(method, ...data);
    });
};

export const signUp = async (method, username, password = '', invite = '') => {
    /** @type {IInviteRegistration} */
    const result = await callMethod(ACTION_SIGNUP, async () => {
        return await signup.signUp(method, username, password, invite);
    });
    if (result && [SIGN_UP_INVITE/*, LOGIN_WEB3, LOGIN_TREZOR*/].includes(method)) {
        if (method === SIGN_UP_INVITE) {
            method = LOGIN_DATA;
        }

        setUserData(username, result.newWallet);
        await signIn(method, username, password, result.newWallet);
    }

    return result;
};

export const logoutLocal = () => {
    return callMethod(ACTION_LOGOUT, async () => {
        console.log('Logout here');
        //return await getLogin.signUp(method, username, password, invite);
        return setUserData(null, null, null);
    });
};

export const setUserData = (username, wallet) => {
    localStorage.setItem('username', username);
    localStorage.setItem('wallet', JSON.stringify(wallet));

    return true;
};

export const getUserData = () => {
    const username = localStorage.getItem('username');
    const wallet = JSON.parse(localStorage.getItem('wallet'));

    return {username, wallet};
};

export const initPage = (pageAction) => {
    doDispatch(getStatus(pageAction, STATUS_INIT));
};

export const callMethod = async (actionName, func) => {
    let result = null;
    try {
        doDispatch(getStatus(actionName, STATUS_START));
        if (!func) {
            throw new LoginError(CODE_EMPTY_METHOD_PARAM);
        }

        result = await func();
        doDispatch(getStatus(actionName, STATUS_SUCCESS), result);
    } catch ({message}) {
        doDispatch(getStatus(actionName, STATUS_FAIL), message);
    }

    doDispatch(getStatus(actionName, STATUS_COMPLETE));

    return result;
};
