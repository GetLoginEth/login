export const reducer = (state, action) => {
    console.log('dispatch', action);
    const merge = (field, data) => {
        return {
            ...state,
            [field]: {...state[field], ...data}
        };
    };
    switch (action.type) {
        case getStatus(ACTION_CHECK_CREDENTIALS, STATUS_SUCCESS):
            return merge('user', action.data);
        case getStatus(ACTION_SIGNIN, STATUS_SUCCESS):
            return merge('user', {status: USER_STATUS_LOGGED});
        case getStatus(ACTION_LOGOUT, STATUS_SUCCESS):
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

export const STATUS_START = 'start';
export const STATUS_SUCCESS = 'success';
export const STATUS_FAIL = 'fail';
export const STATUS_COMPLETE = 'complete';

export const getStatus = (action, status) => {
    return `${action}_${status}`;
};

export const ACTION_CHECK_CREDENTIALS = 'check_credentials';
export const ACTION_SIGNIN = 'signin';
export const ACTION_LOGOUT = 'logout';
export const ACTION_SIGNUP = 'signup';
