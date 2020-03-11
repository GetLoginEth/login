import React, {Fragment, useEffect} from 'react';
import './Settings.css';
import {useStateValue} from "../reducers/state";
import {getLogicContractAddress, getMySessions, test} from "../reducers/actions";
import Spinner from "../Elements/Spinner";

function Settings() {
    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();
    const {state: {mySessions}} = useStateValue();
    const {state: {config}} = useStateValue();

    useEffect(_ => {
        getMySessions().then();
        getLogicContractAddress().then();
    }, []);

    return <Fragment>
        <h1>Settings</h1>
        <p>Username: {user.username}</p>
        <p>Username hash: {user.usernameHash}</p>
        <p>Account address: {user.wallet.address}</p>
        <p>Balance: {user.balance.original}</p>

        {/*<button className="btn btn-primary" onClick={_ => {
            test();
        }}>Test
        </button>*/}

        <h1>My sessions</h1>

        {mySessions.inProcessReceiving && <Spinner/>}

        {!mySessions.inProcessReceiving && mySessions.sessions.length === 0 && <p>Sessions not opened</p>}

        {mySessions.sessions.length > 0 && mySessions.sessions.map((item, i) => <p key={i}>
            App ID: {item.returnValues.appId} / Tx hash: <a target="_blank"
                                                            href={`https://rinkeby.etherscan.io/tx/${item.transactionHash}`}>{item.transactionHash}</a>
        </p>)}

        <details>
            <summary>App info</summary>

            <p>Smart contract address (data): {app.smartContractAddress}</p>
            <p>Smart contract address (logic): {app.smartContractLogicAddress}</p>
            <p>Network: {app.network}</p>
            <p>Provider: {config.websocketProviderUrl}</p>
            <p>Is Trezor enabled: {config.isTrezorEnabled.toString()}</p>
        </details>

    </Fragment>;
}

export default Settings;
