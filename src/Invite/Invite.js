import React, {Fragment, useEffect} from 'react';
import './Invite.css';
import {useStateValue} from "../reducers/state";
import {createInvite, getInvite, getInvites} from "../reducers/actions";
import WaitButton from "../Elements/WaitButton";

function Invite() {
    const {state: {user}} = useStateValue();
    //const {state: {app}} = useStateValue();
    //const {state} = useStateValue();
    const {state: {invite}} = useStateValue();
    const {state: {invite: {inviteInfo}}} = useStateValue();

    useEffect(_ => {
        getInvites(user.usernameHash).then();
    }, []);

    const isCanCreateInvite = Number(user.balance.original) >= Number(0.002);
    return <Fragment>
        <h1>Invites</h1>
        {user.balance.original !== null && !isCanCreateInvite &&
        <p>Your balance must be more than 0.002 ETH to create invite</p>}
        <WaitButton disabled={invite.inProcessCreation}>
            <button disabled={!isCanCreateInvite} className="btn btn-primary" onClick={_ => {
                createInvite().then();
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
            <small>There are public keys. You can not use it as invites</small>
            {invite.invites.map((item, index) => {
                const inviteAddress = item.returnValues.inviteAddress;
                const info = inviteInfo[inviteAddress];

                return <p
                    key={index}>{item.returnValues.inviteAddress} <span
                    className="mr-2">{info && (info.isActive ? '/ Active' : '/ Used')}</span>

                    <button className="btn btn-secondary btn-sm" onClick={_ => {
                        getInvite(item.returnValues.inviteAddress).then();
                    }}>
                        Check
                    </button>

                </p>
            })}
        </div>}
    </Fragment>;
}

export default Invite;
