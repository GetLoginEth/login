import React, {useEffect, useState} from 'react';
import './Signup.css';
import Button from "react-bootstrap/Button";
import {getTrezorAddresses, initPage, getInviteInfo, signUp, resetPassword} from "../reducers/actions";
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
import Modal from "react-bootstrap/Modal";

function Signup() {
    const {state: {signup}} = useStateValue();
    const {state: {invite}} = useStateValue();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inviteData, setInviteData] = useState('');
    const [method, setMethod] = useState('');
    const {state: {config}} = useStateValue();

    const dropDown = [
        {key: SIGN_UP_INVITE, title: 'Invite'},
        //{key: LOGIN_WEB3, title: 'Web3'},
    ];
    if (config.isTrezorEnabled) {
        dropDown.push({key: LOGIN_TREZOR, title: 'Trezor'});
    }

    const [showTrezorModal, setShowTrezorModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showRecoverModal, setShowRecoverModal] = useState(false);
    const [allowResetPassword, setAllowResetPassword] = useState(true);

    //console.log(errors);

    useEffect(() => {
        initPage(ACTION_SIGNUP);

        const invite = window.location.hash.replace('#', '');
        if (config.isTrezorEnabled && !isCorrectInvite(invite)) {
            setMethod(LOGIN_TREZOR);
        } else {
            setInviteData(invite);
            setMethod(SIGN_UP_INVITE);
            if (isCorrectInvite(invite)) {
                getInviteInfo(invite).then();
            }
        }
        //setMethod(SIGN_UP_INVITE);
    }, []);

    const onSubmit = async data => {
        data.preventDefault();

        if (method === LOGIN_TREZOR) {
            // todo check username before interact with trezor
            setShowTrezorModal(true);
            getTrezorAddresses().then();
        } else {
            setShowSettingsModal(true);
            //await signUp(method, username, password, invite);
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
            return username.length < 3 || password.length < 3 || (inviteData.length > 0 && !isCorrectInvite(inviteData)) || signup.inProcess || (method === SIGN_UP_INVITE && !inviteData);
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
                isShow={showTrezorModal}
                onClose={_ => {
                    setShowTrezorModal(false);
                }}
                completeText="Sign up"
                onComplete={(address, addressIndex) => {
                    signUp(LOGIN_TREZOR, username, null, null, {address, addressIndex}).then();
                }}/>

            <Modal id="signupSettings"
                   show={showSettingsModal}
                   onHide={_ => {
                       setShowSettingsModal(false);
                   }} animation={true}>
                <Modal.Header closeButton={!signup.inProcess}>
                    <Modal.Title>Sign up settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please, check settings before sign up</p>

                    <div className="form-group form-check">
                        <input id="allowReset" type="checkbox" className="form-check-input"
                               checked={allowResetPassword}
                               onChange={e => setAllowResetPassword(e.target.checked)}/>
                        <label className="form-check-label" htmlFor="allowReset">
                            Allow password reset with this invite
                            <br/>
                            <small>Anyone who has your invite will be able to reset your password. You can change this
                                setting at any time.</small>
                        </label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={signup.inProcess} variant="secondary" onClick={_ => {
                        setShowSettingsModal(false);
                    }}>
                        Cancel
                    </Button>
                    <Button disabled={signup.inProcess} variant="primary" onClick={_ => {
                        signUp(method, username, password, inviteData, {allowReset: allowResetPassword}).then();
                        setShowSettingsModal(false);
                    }}>
                        Sign up
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal id="recoveryModal"
                   show={showRecoverModal}
                   onHide={_ => {
                       setShowRecoverModal(false);
                   }} animation={true}>
                <Modal.Header closeButton={!signup.inProcess}>
                    <Modal.Title>Recover account</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Here, some info about recovery</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={signup.inProcess} variant="secondary" onClick={_ => {
                        setShowRecoverModal(false);
                    }}>
                        Cancel
                    </Button>
                    <Button disabled={signup.inProcess} variant="primary" onClick={_ => {
                        resetPassword(inviteData).then();
                        //signUp(method, username, password, inviteData, {allowReset: allowResetPassword}).then();
                        setShowRecoverModal(false);
                    }}>
                        Recover
                    </Button>
                </Modal.Footer>
            </Modal>

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
                                      onChange={e => setInviteData(e.target.value)}
                                      value={inviteData}
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

                    <button
                        type="button"
                        disabled={!(invite.info.isActive === false && invite.info.registeredUsername !== '"0x0000000000000000000000000000000000000000000000000000000000000000"')}
                        className="btn btn-link"
                        onClick={_ => {
                            setShowRecoverModal(true);
                        }}>Recover account
                    </button>

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
