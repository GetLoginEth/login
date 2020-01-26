import React, {Fragment} from 'react';
import './Settings.css';
import {useStateValue} from "../reducers/state";
import {test} from "../reducers/actions";

function Settings() {
    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();

    return <Fragment>
        <h1>Settings</h1>
        <p>Username: {user.username}</p>
        <p>Username hash: {user.usernameHash}</p>
        <p>Balance: {user.balance.original}</p>
        <p>Smart contract address: {app.smartContractAddress}</p>
        <p>Network: {app.network}</p>
        <p>Provider: {app.provider}</p>

        <button className="btn btn-primary" onClick={_ => {
            test();
        }}>Test
        </button>
    </Fragment>;
}

export default Settings;
