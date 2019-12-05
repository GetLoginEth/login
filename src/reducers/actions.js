import {
    ACTION_LOGOUT,
    ACTION_SIGNIN,
    ACTION_SIGNUP,
    getStatus,
    STATUS_COMPLETE,
    STATUS_FAIL,
    STATUS_LOG,
    STATUS_START,
    STATUS_SUCCESS
} from "./mainReducer";
import Signup from "../Lib/get-login/signup";
import Signin from "../Lib/get-login/signin";
import {CODE_EMPTY_METHOD_PARAM, LoginError} from "../Lib/get-login/login-error";
import {translate} from "../Lib/get-login/log-translation";

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
    /*checkLocalCredentials();*/
};

/*export const checkLocalCredentials = async () => {
    doDispatch(ACTION_CHECK_CREDENTIALS_START);
    const username = localStorage.getItem('username');
    if(username){

    }

    doDispatch(ACTION_CHECK_CREDENTIALS_SUCCESS);
};*/

export const setDispatch = (newDispatch) => {
    dispatch = newDispatch;
};

export const getDispatch = () => {
    return dispatch;
};

export const signIn = async (method, data = {}) => {
    return callMethod(ACTION_SIGNIN, async () => {
        return await signin.signIn(method, data);
    });
};

export const logoutLocal = () => {
    return callMethod(ACTION_LOGOUT, async () => {
        console.log('Logout here');
        //return await getLogin.signUp(method, username, password, invite);
    });
};

export const signUp = async (method, username, password = '', invite = '') => {
    return callMethod(ACTION_SIGNUP, async () => {
        return await signup.signUp(method, username, password, invite);
    });
};

export const callMethod = async (actionName, func) => {
    try {
        doDispatch(getStatus(actionName, STATUS_START));
        if (!func) {
            throw new LoginError(CODE_EMPTY_METHOD_PARAM);
        }

        const result = await func();
        doDispatch(getStatus(actionName, STATUS_SUCCESS), result);
    } catch ({message}) {
        doDispatch(getStatus(actionName, STATUS_FAIL), message);
    }

    doDispatch(getStatus(actionName, STATUS_COMPLETE));
};
