export const reducer = (state, action) => {
    console.log('dispatch', action);
    const merge = (field, data) => {
        return {
            ...state,
            [field]: {...state[field], ...data}
        };
    };
    switch (action.type) {
        case ACTION_CHECK_CREDENTIALS_COMPLETE:
            return merge('user', action.data);
        case ACTION_SIGNIN_COMPLETE:
            return merge('user', {status: USER_STATUS_LOGGED});
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
export const ACTION_CHECK_CREDENTIALS_COMPLETE = 'check_credentials_complete';
export const ACTION_SIGNIN_START = 'signin_start';
export const ACTION_SIGNIN_COMPLETE = 'signin_complete';
export const ACTION_SIGNIN_FAIL = 'signin_fail';
