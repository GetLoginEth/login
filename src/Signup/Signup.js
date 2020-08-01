import React, {useEffect, useState} from 'react';
import './Signup.css';
import Button from "react-bootstrap/Button";
import {getInviteInfo, getTrezorAddresses, initPage, resetPassword, signUp} from "../reducers/actions";
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
    const {state: {resetPasswordData}} = useStateValue();
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
            /*if (isCorrectInvite(invite)) {
                getInviteInfo(invite).then();
            }*/
        }
        //setMethod(SIGN_UP_INVITE);
    }, []);

    useEffect(_ => {
        if (!isCorrectInvite(inviteData)) {
            return;
        }

        getInviteInfo(inviteData).then();
    }, [inviteData]);

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
            // todo use username/password validation from sign in
            return username.length < 3 || password.length < 3 || (inviteData.length > 0 && !isCorrectInvite(inviteData)) || signup.inProcess || resetPasswordData.inProcess || (method === SIGN_UP_INVITE && !inviteData);
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
                <Modal.Header closeButton={true}>
                    <Modal.Title>Recovery account information</Modal.Title>
                </Modal.Header>
                <Form onSubmit={_ => {
                    _.preventDefault();
                    resetPassword(inviteData, username, password).then();
                }}>
                    <Modal.Body>
                        <p>Invite actual balance: {invite.info.balanceEth} ETH</p>
                        <p>Invite address: {invite.info.inviteAddress}</p>

                        {invite.info.balanceEth >= invite.info.recoveryPriceEth && <>
                            <p className="text-success">You can recover account</p>
                            <fieldset disabled={resetPasswordData.inProcess}>
                                {resetPasswordData.errorMessage && <div className="alert alert-danger" role="alert">
                                    {resetPasswordData.errorMessage}
                                </div>}

                                <Form.Group controlId="recoveryEmail">
                                    <Form.Control type="text"
                                                  name="username"
                                                  placeholder="Username"
                                                  onChange={e => setUsername(e.target.value)}
                                                  value={username}
                                    />
                                </Form.Group>

                                <Form.Group controlId="recoveryPassword">
                                    <Form.Control type="password"
                                                  name="password"
                                                  placeholder="New Password"
                                                  onChange={e => setPassword(e.target.value)}
                                                  value={password}
                                    />
                                </Form.Group>
                            </fieldset>
                        </>}

                        {invite.info.balanceEth < invite.info.recoveryPriceEth &&
                        <>
                            <p className="text-danger">Not enough balance to recover</p>
                            <p>To recover your account you must have at least {invite.info.recoveryPriceEth} ETH.</p>
                        </>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={_ => {
                            setShowRecoverModal(false);
                        }}>
                            Cancel
                        </Button>

                        <WaitButton disabled={resetPasswordData.inProcess}>
                            <Button
                                type="submit"
                                disabled={!(invite.info.isPossibleToRecover && invite.info.balanceEth >= invite.info.recoveryPriceEth) || isDisabled()}
                                variant="primary">
                                Recover
                            </Button>
                        </WaitButton>
                    </Modal.Footer>
                </Form>
            </Modal>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-10 col-lg-12 col-md-9">
                        <div className="card o-hidden border-0 shadow-lg my-5">
                            <div className="card-body p-0">
                                <div className="row">
                                    <div className="col-lg-6 d-none d-lg-block Signup-bg-image"/>
                                    <div className="col-lg-6">
                                        <div className="p-4">

                                            <h5 className="card-title">Sign up</h5>

                                            <Form className="Signup" onSubmit={onSubmit}>
                                                <fieldset disabled={signup.inProcess}>
                                                    {/*<h1>Sign up / <Link to="./login">Sign in</Link></h1>*/}

                                                    {signup.errorMessage &&
                                                    <div className="alert alert-danger" role="alert">
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

                                                    <Form.Group controlId="formBasicPassword"
                                                                className={(method === LOGIN_TREZOR) ? "d-none" : ""}>
                                                        <Form.Control type="password"
                                                                      name="password"
                                                                      placeholder="Password"
                                                                      onChange={e => setPassword(e.target.value)}
                                                                      value={password}
                                                        />
                                                    </Form.Group>

                                                    <Form.Group controlId="formInvite"
                                                                className={(method === SIGN_UP_INVITE) ? "" : "d-none"}>
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
                                                            >
                                                                Sign up with {getDropDownTitle(method)}
                                                            </Button>
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

                                                    <WaitButton disabled={invite.info.inProcess}>
                                                        <button
                                                            type="button"
                                                            disabled={!invite.info.isPossibleToRecover || !isCorrectInvite(inviteData)}
                                                            className="btn btn-link"
                                                            onClick={_ => {
                                                                setShowRecoverModal(true);
                                                            }}>
                                                            Recover account
                                                        </button>
                                                    </WaitButton>

                                                    {signup.log.length > 0 && <details className="mt-2">
                                                        <summary>{signup.status}</summary>
                                                        {signup.log.map((item, index) => <p key={index}>{item}</p>)}
                                                    </details>}
                                                </fieldset>
                                            </Form>
                                            <hr/>
                                            <div className="text-center d-flex justify-content-between">
                                                <Link className="small" to="./login">Want to Sign in?</Link>
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

export default Signup;
