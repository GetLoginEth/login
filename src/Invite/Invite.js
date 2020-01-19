import React, {Fragment, useEffect} from 'react';
import './Invite.css';
import {useStateValue} from "../reducers/state";
import {getInvites} from "../reducers/actions";

function Invite() {
    const {state: {user}} = useStateValue();
    const {state: {app}} = useStateValue();
    const {state: {invite}} = useStateValue();

    useEffect(_ => {
        getInvites(user.username).then();
    }, []);

    console.log(user);
    console.log(invite);
    return <Fragment>
        <h1>Invites</h1>
        <p>Username: {user.username}</p>
        {invite.invites.length > 0 && invite.invites.map((item, index) => <p key={index}>{item}</p>)}
    </Fragment>;
}

export default Invite;
