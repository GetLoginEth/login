import React, {Fragment, useEffect, useState} from 'react';
import './Settings.css';
import {useStateValue} from "../reducers/state";
import {changePassword, getLocalType, getLogicContractAddress, getMySessions} from "../reducers/actions";
import Spinner from "../Elements/Spinner";
import {LOGIN_DATA} from "../Lib/get-login/signin";
import WaitButton from "../Elements/WaitButton";
import {LOGIN_USERNAME_PASSWORD} from "../Lib/get-login/changePassword";

function Settings() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');

    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();
    const {state: {mySessions}} = useStateValue();
    const {state: {config}} = useStateValue();
    const {state: {password}} = useStateValue();

    const isPasswordsValid = () => {
        if (oldPassword.length < 3 || newPassword.length < 3 || newPasswordRepeat.length < 3) {
            return false;
        }

        return oldPassword !== newPassword && newPassword === newPasswordRepeat;
    };

    useEffect(_ => {
        getMySessions().then();
        getLogicContractAddress().then();
    }, []);

    return <Fragment>
        <h1 className="mt-3">Settings</h1>
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

        {(getLocalType() === LOGIN_DATA || getLocalType() === LOGIN_USERNAME_PASSWORD) && <details>
            <summary>Change password</summary>

            <form onSubmit={e => {
                e.preventDefault();
                if (isPasswordsValid()) {
                    changePassword(user.username, oldPassword, newPassword)
                        .then(data => {
                            if (data) {
                                setOldPassword('');
                                setNewPassword('');
                                setNewPasswordRepeat('');
                            }
                        });
                }
            }}>
                <fieldset disabled={password.inProcess}>
                    <div className="form-group">
                        <label>Old password</label>
                        <input type="password" className="form-control" value={oldPassword} onChange={e => {
                            setOldPassword(e.target.value);
                        }}/>
                    </div>

                    <div className="form-group">
                        <label>New password</label>
                        <input type="password" className="form-control" value={newPassword} onChange={e => {
                            setNewPassword(e.target.value);
                        }}/>
                    </div>

                    <div className="form-group">
                        <label>Repeat new password</label>
                        <input type="password" className="form-control" value={newPasswordRepeat} onChange={e => {
                            setNewPasswordRepeat(e.target.value);
                        }}/>
                    </div>

                    <WaitButton disabled={password.inProcess}>
                        <button type="submit" className="btn btn-primary" disabled={!isPasswordsValid()}>Save</button>
                    </WaitButton>

                    <p>{password.status}</p>
                    {password.errorMessage && <p className="text-danger">{password.errorMessage}</p>}
                </fieldset>
            </form>
        </details>}

    </Fragment>;
}

export default Settings;
