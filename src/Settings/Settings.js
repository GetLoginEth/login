import React, {Fragment} from 'react';
import './Settings.css';
import {useStateValue} from "../reducers/state";

function Settings() {
    const {state: {user}} = useStateValue();

    return <Fragment>
        <h1>Settings</h1>
        Username: {user.username}
    </Fragment>;
}

export default Settings;
