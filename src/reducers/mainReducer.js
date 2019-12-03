export const reducer = (state, action) => {
    console.log('dispatch', action);
    const merge = (field, data) => {
        return {
            ...state,
            [field]: {...state[field], ...data}
        };
    };
    switch (action.type) {
        case ACTION_CHECK_CREDENTIALS_SUCCESS:
            return merge('user', action.data);
        case ACTION_SIGNIN_SUCCESS:
            return merge('user', {status: USER_STATUS_LOGGED});
        case ACTION_LOGOUT_LOCAL_SUCCESS:
            return merge('user', {status: USER_STATUS_NOT_LOGGED});
        default:
            return state;
    }
};

export const USER_STATUS_NOT_LOGGED = 'not_logged';
export const USER_STATUS_LOGGED = 'logged';

export const initialState = {
    user: {
        isLoggedIn: function () {
            return this.status === USER_STATUS_LOGGED;
        },
        status: USER_STATUS_NOT_LOGGED
    }
};

export const ACTION_CHECK_CREDENTIALS_START = 'check_credentials_start';
export const ACTION_CHECK_CREDENTIALS_SUCCESS = 'check_credentials_success';
export const ACTION_CHECK_CREDENTIALS_FAIL = 'check_credentials_fail';

export const ACTION_SIGNIN_START = 'signin_start';
export const ACTION_SIGNIN_SUCCESS = 'signin_complete';
export const ACTION_SIGNIN_FAIL = 'signin_fail';

export const ACTION_LOGOUT_LOCAL_START = 'logout_local_start';
export const ACTION_LOGOUT_LOCAL_SUCCESS = 'logout_local_success';
export const ACTION_LOGOUT_LOCAL_FAIL = 'logout_local_fail';

export const ACTION_SIGNUP = 'signup';
export const ACTION_SIGNUP_START = 'signup_start';
export const ACTION_SIGNUP_SUCCESS = 'signup_success';
export const ACTION_SIGNUP_FAIL = 'signup_fail';
