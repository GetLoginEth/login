import React, {createContext, useContext, useReducer} from 'react';
import {getDispatch, init} from "./actions";

export const StateContext = createContext();

export const StateProvider = ({reducer, initialState, children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    if (dispatch && !getDispatch()) {
        init(dispatch);
    }

    return (
        <StateContext.Provider value={{state, dispatch}}>
            {children}
        </StateContext.Provider>
    );
};

export const useStateValue = () => useContext(StateContext);
