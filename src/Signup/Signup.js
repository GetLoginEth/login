import React, {useEffect, useState} from 'react';
import './Signup.css';
import Button from "react-bootstrap/Button";
import {signUp} from "../reducers/actions";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {SIGN_UP_INVITE, SIGN_UP_TREZOR, SIGN_UP_WEB3} from "../Lib/get-login/signup";

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invite, setInvite] = useState('');
    const [method, setMethod] = useState('');
    const dropDown = [
        {key: SIGN_UP_INVITE, title: 'Invite'},
        {key: SIGN_UP_WEB3, title: 'Web3'},
        {key: SIGN_UP_TREZOR, title: 'Trezor'}
    ];
    useEffect(() => {
        const invite = window.location.hash.replace('#', '');
        if (isCorrectInvite(invite)) {
            setInvite(invite);
            setMethod(SIGN_UP_INVITE);
        } else {
            setMethod(SIGN_UP_WEB3);
        }
    }, []);
    const isCorrectInvite = (invite) => {
        return invite.length === 32;
    };
    const isDisabled = () => {
        return username.length < 3 || password.length < 3 || (invite.length > 0 && !isCorrectInvite(invite));
    };
    const onDropDownChange = (item) => {
        setMethod(item.key);
    };
    const getDropDownTitle = (key) => {
        const result = dropDown.find(item => item.key === key);
        if (result) {
            return result.title;
        } else {
            return 'Incorrect item';
        }
    };

    return (
        <div className="row justify-content-center align-items-center">
            <Form className="LoginForm col-md-4">
                <h1>Sign up</h1>

                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}
                                  value={username}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}
                                  value={password}/>
                </Form.Group>

                <Form.Group controlId="formInvite" className={(method === SIGN_UP_INVITE) ? "" : "d-none"}>
                    <Form.Control type="text" placeholder="Invite" onChange={e => setInvite(e.target.value)}
                                  value={invite}/>
                </Form.Group>


                <Dropdown as={ButtonGroup} className="btn-block">
                    <Button variant="primary"
                            className="col-md-10"
                            disabled={isDisabled()}
                            onClick={() => signUp(method, username, password, invite)}>Sign up
                        with {getDropDownTitle(method)}</Button>

                    <Dropdown.Toggle className="" split variant="primary" id="dropdown-split-basic"/>

                    <Dropdown.Menu>
                        {dropDown.map(item => <Dropdown.Item
                            key={item.key}
                            onClick={e => onDropDownChange(item)}>{item.title}</Dropdown.Item>)}
                    </Dropdown.Menu>
                </Dropdown>


            </Form>
        </div>
    );
}

export default Signup;
