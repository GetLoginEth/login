import {ACTION_CHANGE_THEME} from "./mainReducer";

let dispatch = null;

export const setDispatch = (newDispatch) => {
    dispatch = newDispatch;
};

export const getDispatch = () => {
    return dispatch;
};

export const changeTheme = (theme) => {
    dispatch({
        type: ACTION_CHANGE_THEME,
        newTheme: {primary: theme}
    });
};
