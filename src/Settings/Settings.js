import React, {Fragment} from 'react';
import './Settings.css';
import {useStateValue} from "../reducers/state";

function Settings() {
    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();

    return <Fragment>
        <h1>Settings</h1>
        <p>Username: {user.username}</p>
        <p>Username hash: {user.usernameHash}</p>
        <p>Smart contract address: {app.smartContractAddress}</p>
        <p>Network: {app.network}</p>
        <p>Provider: {app.provider}</p>
    </Fragment>;
}

export default Settings;
