import React, {Fragment, useEffect} from 'react';
import './Invite.css';
import {useStateValue} from "../reducers/state";
import {createInvite, getInvites} from "../reducers/actions";

function Invite() {
    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();
    const {state: {invite}} = useStateValue();

    useEffect(_ => {
        getInvites(user.usernameHash).then(data => {
            console.log(data);
        });
    }, []);

    console.log(invite);
    return <Fragment>
        <h1>Invites</h1>
        <button className="btn btn-primary" onClick={_ => {
            createInvite().then();
        }}>Create invite
        </button>
        <p>Username: {user.username}</p>
        {invite.invites.length > 0 && invite.invites.map((item, index) => <p key={index}>{item}</p>)}
    </Fragment>;
}

export default Invite;
