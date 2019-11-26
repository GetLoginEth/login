import React, {Component} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';

class Main extends Component {
    render() {
        const {state} = this.context;

        return <div>
            <p>Main public page</p>

            {state.user &&
            <button onClick={_ => {
                //changeTheme('lololo');
            }}>
                Boom -- {state.user.login}, {state.user.password}
            </button>}
        </div>;
    }
}

Main.contextType = StateContext;

export default Main;
