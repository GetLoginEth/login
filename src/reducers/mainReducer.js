import {StateContext, useStateValue} from './state';

//const [{}, dispatch] = useStateValue();

export const reducer = (state, action) => {
    console.log('dispatch', action);
    switch (action.type) {
        case ACTION_CHANGE_THEME:
            return {
                ...state,
                theme: action.newTheme
            };

        default:
            return state;
    }
};

export const initialState = {
    theme: {
        primary: 'green'
    }
};

export const ACTION_CHANGE_THEME = 'change_theme';
