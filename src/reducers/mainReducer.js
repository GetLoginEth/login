export const reducer = (state, action) => {
    console.log('dispatch', action);
    switch (action.type) {
        case ACTION_CHECK_CREDENTIALS_COMPLETE:
            return {
                ...state,
                user: action.data
            };

        default:
            return state;
    }
};

export const initialState = {
    theme: {
        primary: 'green',
    }
};

export const ACTION_CHANGE_THEME = 'change_theme';
export const ACTION_CHECK_CREDENTIALS_START = 'check_credentials_start';
export const ACTION_CHECK_CREDENTIALS_COMPLETE = 'check_credentials_complete';
