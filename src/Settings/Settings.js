import React, {Fragment, useEffect, useState} from 'react';
import './Settings.css';
import {useStateValue} from "../reducers/state";
import {
    changePassword,
    closeSession,
    getAllSettings,
    getLocalType,
    getLocalUsernameHash,
    getLogicContractAddress,
    getMySessions,
    setInviteReset
} from "../reducers/actions";
import Spinner from "../Elements/Spinner";
import {LOGIN_DATA} from "../Lib/get-login/signin";
import WaitButton from "../Elements/WaitButton";
import {LOGIN_USERNAME_PASSWORD} from "../Lib/get-login/changePassword";

function Settings() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [isPasswordChanged, setIsPasswordChanged] = useState(null);

    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();
    const {state: {mySessions}} = useStateValue();
    const {state: {config}} = useStateValue();
    const {state: {password}} = useStateValue();
    const {state: {settings}} = useStateValue();

    const isPasswordsValid = () => {
        if (oldPassword.length < 3 || newPassword.length < 3 || newPasswordRepeat.length < 3) {
            return false;
        }

        return oldPassword !== newPassword && newPassword === newPasswordRepeat;
    };

    useEffect(_ => {
        getMySessions().then();
        getLogicContractAddress().then();
        getAllSettings(getLocalUsernameHash()).then();
    }, []);

    return <Fragment>
        {(getLocalType() === LOGIN_DATA || getLocalType() === LOGIN_USERNAME_PASSWORD) &&
        <Fragment>
            <h1>Change password</h1>

            {password.errorMessage && <div className="alert alert-danger" role="alert">
                {password.errorMessage}
            </div>}

            {isPasswordChanged && <div className="alert alert-success" role="alert">
                Password changed
            </div>}

            <form onSubmit={e => {
                e.preventDefault();
                setIsPasswordChanged(null);
                if (!isPasswordsValid()) {
                    return;
                }

                changePassword(user.username, oldPassword, newPassword).then(data => {
                    if (data) {
                        setIsPasswordChanged(true);
                        setOldPassword('');
                        setNewPassword('');
                        setNewPasswordRepeat('');
                    }
                });
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
                </fieldset>
            </form>
        </Fragment>}

        <details>
            <summary>Profile info</summary>

            <p>Username: {user.username}</p>
            <p>Username hash: {user.usernameHash}</p>
            <p>Account address: {user.wallet.address}</p>
            <p>Balance: {user.balance.original} {app.currency}</p>

            <fieldset disabled={settings.inProcess}>
                <div className="form-group form-check">
                    <input id="allowReset" type="checkbox" className="form-check-input"
                           checked={settings.inviteReset === "true"}
                           onChange={e => {
                               if (window.confirm('This action send transaction to network. Confirm?')) {
                                   setInviteReset(e.target.checked).then();
                               }
                           }}/>
                    <WaitButton disabled={settings.inProcess}>
                        <label className="form-check-label" htmlFor="allowReset">
                            Allow password reset
                            <br/>
                            <small>If checked, anyone who has your invite will be able to reset your password</small>
                        </label>
                    </WaitButton>
                </div>
            </fieldset>
        </details>

        {/*<button className="btn btn-primary" onClick={_ => {
            test();
        }}>Test
        </button>*/}
        <hr/>

        {mySessions.sessions.length > 0 &&
        <Fragment>
            <details>
                <summary>My sessions</summary>

                {mySessions.inProcessReceiving && <Spinner/>}

                {mySessions.sessions.length > 0 && <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Tx hash</th>
                        <th scope="col">Manage</th>
                    </tr>
                    </thead>
                    <tbody>

                    {mySessions.sessions.map((item, i) =>
                        <tr key={i}>
                            <th scope="row">
                                {item.returnValues.appId}
                            </th>
                            <td>
                                <a target="_blank" rel="noopener noreferrer"
                                   href={`${app.explorerUrl}${item.transactionHash}`}>
                                    {item.transactionHash}
                                </a>
                            </td>
                            <td>
                                {item.returnValues.iv.length === 0 && <p>Session closed</p>}
                                {item.returnValues.iv.length > 0 &&
                                <WaitButton disabled={mySessions.inProcessClose && mySessions.closeId === item.id}>
                                    <button disabled={item.returnValues.iv === ''} className="btn btn-danger btn-sm"
                                            onClick={_ => {
                                                if (window.confirm('Really close? Tokens stored in this session will be lost. Move tokens before closing the session.')) {
                                                    closeSession(item.returnValues.appId, item.id).then();
                                                }
                                            }}>Close
                                    </button>
                                </WaitButton>}
                            </td>
                        </tr>
                    )}

                    {!mySessions.inProcessReceiving && mySessions.sessions.length === 0 && <tr>
                        <td colSpan="7">
                            <div className="empty">No results found.</div>
                        </td>
                    </tr>}

                    </tbody>
                </table>}
            </details>
            <hr/>
        </Fragment>}

        <details>
            <summary>App info</summary>

            <p>Smart contract address (data): {app.smartContractAddress}</p>
            <p>Smart contract address (logic): {app.smartContractLogicAddress}</p>
            <p>Network: {app.network}</p>
            {/*<p>Provider: {config.websocketProviderUrl}</p>*/}
            {/*<p>Is Trezor enabled: {config.isTrezorEnabled.toString()}</p>*/}
        </details>


    </Fragment>;
}

export default Settings;
