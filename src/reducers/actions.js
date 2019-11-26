import {
    ACTION_CHECK_CREDENTIALS_COMPLETE,
    ACTION_CHECK_CREDENTIALS_START,
    ACTION_SIGNIN_COMPLETE,
    ACTION_SIGNIN_START
} from "./mainReducer";

let dispatch = null;

export const doDispatch = (type, data = {}) => {
    dispatch({type, data});
};

export const init = (dispatch) => {
    setDispatch(dispatch);
    checkLocalCredentials();
};

export const checkLocalCredentials = () => {
    doDispatch(ACTION_CHECK_CREDENTIALS_START);
    doDispatch(ACTION_CHECK_CREDENTIALS_COMPLETE, {
        login: 'hello',
        password: 'world',
    });
};

export const setDispatch = (newDispatch) => {
    dispatch = newDispatch;
};

export const getDispatch = () => {
    return dispatch;
};

export const signInUsernamePassword = (username, password) => {
    doDispatch(ACTION_SIGNIN_START);
    doDispatch(ACTION_SIGNIN_COMPLETE);
};
