import React, {Component} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';
import {ACTION_CHANGE_THEME} from "../reducers/mainReducer";

class Main extends Component {
    static contextType = StateContext;

    render() {
        const [{theme}, dispatch] = this.context;

        return <div>

            <p>Main public page</p>

            <button onClick={_ => {
                dispatch({
                    type: ACTION_CHANGE_THEME,
                    newTheme: {primary: 'blue'}
                })
            }}>
                Boom {theme.primary}
            </button>
        </div>;
    }
}

export default Main;
