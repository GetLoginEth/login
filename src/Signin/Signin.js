import React, {useEffect, useState} from 'react';
import './Signin.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {getTrezorAddresses, initPage, signIn} from "../reducers/actions";
import {LOGIN_USERNAME_PASSWORD} from "../Lib/get-login/signin";
import {useStateValue} from "../reducers/state";
import {Link} from "react-router-dom";
import {LOGIN_TREZOR, validatePassword, validateUsername} from "../Lib/get-login/utils";
import {ACTION_SIGNIN} from "../reducers/mainReducer";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import WaitButton from "../Elements/WaitButton";
import Dropdown from "react-bootstrap/Dropdown";
import TrezorSelectWallet from "../Elements/TrezorSelectWallet";

function Signin() {
    const {state: {signin}} = useStateValue();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [method, setMethod] = useState(LOGIN_USERNAME_PASSWORD);
    const [showModal, setShowModal] = useState(false);
    const {state: {config}} = useStateValue();

    const dropDown = [
        {key: LOGIN_USERNAME_PASSWORD, title: 'Password'},
    ];

    if (config.isTrezorEnabled) {
        dropDown.push({key: LOGIN_TREZOR, title: 'Trezor'});
    }

    useEffect(() => {
        initPage(ACTION_SIGNIN);
    }, []);

    const isDisabled = () => {
        let result = true;
        try {
            validateUsername(username);
            if (method !== LOGIN_TREZOR) {
                validatePassword(password);
            }
            result = false;
        } catch (e) {

        }

        return result;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (method === LOGIN_TREZOR) {
            setShowModal(true);
            getTrezorAddresses().then();
        } else {
            signIn(LOGIN_USERNAME_PASSWORD, username, password).then();
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
                completeText="Sign in"
                onComplete={(address, addressIndex) => {
                    signIn(LOGIN_TREZOR, username, null, null, {address, addressIndex}).then();
                }}/>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block Signin-bg-image"/>
                                    <div className="col-lg-6">
                                        <div className="p-4">

                                            <h5 className="card-title">Sign in</h5>

                                            <Form className="Signin " onSubmit={onSubmit}>
                                                <fieldset disabled={signin.inProcess}>
                                                    {/*<h1>Sign in / <Link to="./xsignup">Sign up</Link></h1>*/}

                                                    {signin.errorMessage &&
                                                    <div className="alert alert-danger" role="alert">
                                                        {signin.errorMessage}
                                                    </div>}

                                                    <Form.Group controlId="formBasicEmail">
                                                        <Form.Control type="text" placeholder="Username"
                                                                      onChange={e => setUsername(e.target.value)}
                                                                      value={username}/>
                                                    </Form.Group>

                                                    <Form.Group controlId="formBasicPassword"
                                                                className={(method === LOGIN_TREZOR) ? "d-none" : ""}>
                                                        <Form.Control type="password" placeholder="Password"
                                                                      onChange={e => setPassword(e.target.value)}
                                                                      value={password}/>
                                                    </Form.Group>

                                                    <Dropdown as={ButtonGroup} className="btn-block">
                                                        <WaitButton disabled={signin.inProcess}>
                                                            <Button variant="primary"
                                                                    type="submit"
                                                                    className={dropDown.length > 1 ? "col-md-10" : "col-md-12"}
                                                                    disabled={isDisabled()}
                                                            >Sign in with {getDropDownTitle(method)}</Button>
                                                        </WaitButton>

                                                        {dropDown.length > 1 &&
                                                        <Dropdown.Toggle className="" split variant="primary"
                                                                         id="dropdown-split-basic"/>}

                                                        {dropDown.length > 1 && <Dropdown.Menu>
                                                            {dropDown.map(item => <Dropdown.Item
                                                                key={item.key}
                                                                onClick={e => onDropDownChange(item)}>{item.title}</Dropdown.Item>)}
                                                        </Dropdown.Menu>}
                                                    </Dropdown>

                                                    {signin.log.length > 0 && <details className="mt-2">
                                                        <summary>{signin.status}</summary>
                                                        {signin.log.map((item, index) => <p key={index}>{item}</p>)}
                                                    </details>}
                                                </fieldset>
                                            </Form>
                                            <hr/>
                                            <div className="text-center d-flex justify-content-between">
                                                <Link className="small" to="./xsignup">Forgot Password?</Link>

                                                <Link className="small" to="./xsignup">Create an Account!</Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;
