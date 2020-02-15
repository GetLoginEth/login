import React, {useEffect, useState} from 'react';
import './Signup.css';
import Button from "react-bootstrap/Button";
import {getTrezorAddresses, initPage, signUp} from "../reducers/actions";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {SIGN_UP_INVITE} from "../Lib/get-login/signup";
import {useStateValue} from "../reducers/state";
import {Link} from "react-router-dom";
import {LOGIN_TREZOR, validateInvite} from "../Lib/get-login/utils";
import {ACTION_SIGNUP} from "../reducers/mainReducer";
import WaitButton from "../Elements/WaitButton";
import TrezorSelectWallet from "../Elements/TrezorSelectWallet";

function Signup() {
    const {state: {signup}} = useStateValue();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invite, setInvite] = useState('');
    const [method, setMethod] = useState('');
    const {state: {config}} = useStateValue();

    const dropDown = [
        {key: SIGN_UP_INVITE, title: 'Invite'},
        //{key: LOGIN_WEB3, title: 'Web3'},
    ];
    if (config.isTrezorEnabled) {
        dropDown.push({key: LOGIN_TREZOR, title: 'Trezor'});
    }

    const [showModal, setShowModal] = useState(false);

    //console.log(errors);

    useEffect(() => {
        initPage(ACTION_SIGNUP);

        const invite = window.location.hash.replace('#', '');
        if (config.isTrezorEnabled && !isCorrectInvite(invite)) {
            setMethod(LOGIN_TREZOR);
        } else {
            setInvite(invite);
            setMethod(SIGN_UP_INVITE);
        }
        //setMethod(SIGN_UP_INVITE);
    }, []);

    const onSubmit = async data => {
        data.preventDefault();

        if (method === LOGIN_TREZOR) {
            // todo check username before interact with trezor
            setShowModal(true);
            getTrezorAddresses().then();
        } else {
            await signUp(method, username, password, invite);
        }
    };

    const isCorrectInvite = (invite) => {
        let result = true;
        try {
            validateInvite(invite);
        } catch {
            result = false;
        }

        return result;
    };
    const isDisabled = () => {
        if (method === LOGIN_TREZOR) {
            return username.length < 3;
        } else {
            // todo copy username password validation from sign in
            return username.length < 3 || password.length < 3 || (invite.length > 0 && !isCorrectInvite(invite)) || signup.inProcess || (method === SIGN_UP_INVITE && !invite);
        }
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
            <TrezorSelectWallet
                isShow={showModal}
                onClose={_ => {
                    setShowModal(false);
                }}
                completeText="Sign up"
                onComplete={(address, addressIndex) => {
                    signUp(LOGIN_TREZOR, username, null, null, {address, addressIndex}).then();
                }}/>

            <Form className="Signup col-md-4" onSubmit={onSubmit}>
                <fieldset disabled={signup.inProcess}>
                    <h1>Sign up / <Link to="./login">Sign in</Link></h1>

                    {signup.errorMessage && <div className="alert alert-danger" role="alert">
                        {signup.errorMessage}
                    </div>}

                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text"
                                      name="username"
                                      placeholder="Username"
                                      onChange={e => setUsername(e.target.value)}
                                      value={username}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className={(method === LOGIN_TREZOR) ? "d-none" : ""}>
                        <Form.Control type="password"
                                      name="password"
                                      placeholder="Password"
                                      onChange={e => setPassword(e.target.value)}
                                      value={password}
                        />
                    </Form.Group>

                    <Form.Group controlId="formInvite" className={(method === SIGN_UP_INVITE) ? "" : "d-none"}>
                        <Form.Control type="text"
                                      name="invite"
                                      placeholder="Invite"
                                      onChange={e => setInvite(e.target.value)}
                                      value={invite}
                        />
                    </Form.Group>

                    <Dropdown as={ButtonGroup} className="btn-block">
                        <WaitButton disabled={signup.inProcess}>
                            <Button variant="primary"
                                    type="submit"
                                    className={dropDown.length > 1 ? "col-md-10" : "col-md-12"}
                                    disabled={isDisabled()}
                            >Sign up with {getDropDownTitle(method)}</Button>
                        </WaitButton>

                        {dropDown.length > 1 && <Dropdown.Toggle className="" split variant="primary"
                                                                 id="dropdown-split-basic"/>}

                        {dropDown.length > 1 && <Dropdown.Menu>
                            {dropDown.map(item => <Dropdown.Item
                                key={item.key}
                                onClick={e => onDropDownChange(item)}>{item.title}</Dropdown.Item>)}
                        </Dropdown.Menu>}
                    </Dropdown>

                    {signup.log.length > 0 && <details className="mt-2">
                        <summary>{signup.status}</summary>
                        {signup.log.map((item, index) => <p key={index}>{item}</p>)}
                    </details>}
                </fieldset>
            </Form>
        </div>
    );
}

export default Signup;
