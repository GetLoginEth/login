import React, {Component, Fragment} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';
import Button from "react-bootstrap/Button";

class Main extends Component {
    render() {
        const {state} = this.context;

        return <Fragment>
            <p>Main public page</p>

            {state.user && <Button onClick={_ => {
                //changeTheme('lololo');
            }}>Pickckckc {state.user.login}, {state.user.password}</Button>
            }

        </Fragment>;
    }
}

Main.contextType = StateContext;

export default Main;
