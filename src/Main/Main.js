import React, {Component} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';
import {Link} from "react-router-dom";

class Main extends Component {
    render() {
        const {state} = this.context;

        return <div className="text-center">
            <h1>Web3 Auth plugin</h1>

            {state.user.isLoggedIn() ? <Link className="btn btn-success btn-lg" to="./xsettings">Open Settings</Link> :
                <Link className="btn btn-success btn-lg" to="./signup">Sign up</Link>}
        </div>;
    }
}

Main.contextType = StateContext;

export default Main;
