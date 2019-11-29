import {
    ACTION_CHECK_CREDENTIALS_SUCCESS,
    ACTION_CHECK_CREDENTIALS_START, ACTION_LOGOUT_LOCAL_SUCCESS, ACTION_LOGOUT_LOCAL_START,
    ACTION_SIGNIN_SUCCESS, ACTION_SIGNIN_FAIL,
    ACTION_SIGNIN_START, ACTION_SIGNUP_START, ACTION_SIGNUP_SUCCESS, ACTION_SIGNUP_FAIL
} from "./mainReducer";
import GetLogin, {SIGN_IN_RESULT_SUCCESS, SIGN_UP_RESULT_SUCCESS} from "../Lib/GetLogin";

let dispatch = null;
let getLogin = null;

export const doDispatch = (type, data = {}) => {
    dispatch({type, data});
};

export const init = (dispatch) => {
    setDispatch(dispatch);
    getLogin = new GetLogin();
    getLogin.setLogger({
        log: (type, data) => {
            // todo add to reducer
            console.log(type, data);
        }
    })
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
    doDispatch(ACTION_SIGNIN_START);
    const result = await getLogin.signIn(method, data);
    if (result.result === SIGN_IN_RESULT_SUCCESS) {
        doDispatch(ACTION_SIGNIN_SUCCESS);
    } else {
        doDispatch(ACTION_SIGNIN_FAIL);
    }
};

export const logoutLocal = () => {
    doDispatch(ACTION_LOGOUT_LOCAL_START);
    doDispatch(ACTION_LOGOUT_LOCAL_SUCCESS);
};

export const signUp = async (method, username, password = '', invite = '') => {
    doDispatch(ACTION_SIGNUP_START);
    const result = await getLogin.signUp(method, username, password, invite);
    if (result.result === SIGN_UP_RESULT_SUCCESS) {
        doDispatch(ACTION_SIGNIN_SUCCESS);
    } else {
        doDispatch(ACTION_SIGNIN_FAIL);
    }
};
