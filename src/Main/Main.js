import React, {Component} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';
import {changeTheme} from "../reducers/actions";

class Main extends Component {
    render() {
        const {state} = this.context;

        return <div>
            <p>Main public page</p>

            <button onClick={_ => {
                changeTheme('lololo');
            }}>
                Boom -- {state.theme.primary}
            </button>
        </div>;
    }
}

Main.contextType = StateContext;

export default Main;
