import React, {Fragment, useEffect} from 'react';
import './Invite.css';
import {useStateValue} from "../reducers/state";
import {createInvite, getInvite, getInvitePrice, getInvites} from "../reducers/actions";
import WaitButton from "../Elements/WaitButton";

function Invite() {
    const {state: {user}} = useStateValue();
    const {state: {invite}} = useStateValue();
    const {state: {invite: {inviteInfo}}} = useStateValue();

    useEffect(_ => {
        getInvitePrice().then();
        getInvites(user.usernameHash).then();
    }, []);

    // todo get invite min value from global state
    const isCanCreateInvite = invite.price ? Number(user.balance.original) >= Number(invite.price) : false;
    return <Fragment>
        <h1>Invites</h1>

        {invite.errorMessage && <div className="alert alert-danger" role="alert">
            {invite.errorMessage}
        </div>}

        {user.balance.original !== null && invite.price > 0 && !isCanCreateInvite &&
        <p>Your balance must be more than {invite.price} ETH to create invite</p>}
        {isCanCreateInvite && invite.price > 0 && <p>Invite creation cost {invite.priceWeb} ETH</p>}
        <WaitButton disabled={invite.inProcessCreation}>
            <button disabled={!isCanCreateInvite} className="btn btn-primary" onClick={_ => {
                createInvite(invite.price).then();
            }}>Create invite
            </button>
        </WaitButton>

        {invite.createdInvites.length > 0 && <div className="mt-3">
            <h4>Created invites</h4>
            <small>You can send these invites for new users</small>
            {invite.createdInvites.map((item, index) => {
                return <p key={index}><span style={{color: 'green'}}>{item.privateKey.replace('0x', '')}</span><br/>
                    <small
                        style={{color: 'grey'}}>Public
                        address: {item.address}</small></p>
            })}
        </div>}

        {invite.invites.length > 0 && <div className="mt-3">
            <h4>Previously created invites</h4>
            <small>There are public addresses. You can not use it as invites</small>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">Address</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>

                {invite.invites.map((item, index) => {
                    const inviteAddress = item.returnValues.inviteAddress;
                    const info = inviteInfo[inviteAddress];

                    return <tr key={index}>
                        <td>
                            {item.returnValues.inviteAddress} <span
                            className="mr-2">{info && (info.isActive ? '/ Active' : '/ Used')}</span>
                        </td>
                        <td>
                            <button className="btn btn-secondary btn-sm" onClick={_ => {
                                getInvite(item.returnValues.inviteAddress).then();
                            }}>
                                Check
                            </button>
                        </td>
                    </tr>;
                })}

                </tbody>
            </table>
        </div>}
    </Fragment>;
}

export default Invite;
