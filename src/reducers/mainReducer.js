export const reducer = (state, action) => {
    console.log('dispatch', action);
    switch (action.type) {
        case ACTION_CHECK_CREDENTIALS_COMPLETE:
            return {
                ...state,
                user: {...state.user, ...action.data}
            };

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
