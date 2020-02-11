import React, {useEffect, useState} from 'react';
import './Signup.css';
import Button from "react-bootstrap/Button";
import {getTrezorAddresses, initPage, signUp} from "../reducers/actions";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {SIGN_UP_INVITE} from "../Lib/get-login/signup";
import {useStateValue} from "../reducers/state";
import {Link} from "react-router-dom";
import {LOGIN_TREZOR, LOGIN_WEB3, validateInvite} from "../Lib/get-login/utils";
import {ACTION_SIGNUP} from "../reducers/mainReducer";
import Spinner from "../Elements/Spinner";
import WaitButton from "../Elements/WaitButton";

function Signup() {
    const {state: {signup}} = useStateValue();
    const {state: {trezorAddresses}} = useStateValue();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invite, setInvite] = useState('');
    const [method, setMethod] = useState('');
    const dropDown = [
        {key: SIGN_UP_INVITE, title: 'Invite'},
        //{key: LOGIN_WEB3, title: 'Web3'},
        {key: LOGIN_TREZOR, title: 'Trezor'}
    ];

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [trezorAddress, setTrezorAddress] = useState(null);
    const [trezorAddressIndex, setTrezorAddressIndex] = useState(null);
    const changeTrezorAddress = changeEvent => {
        setTrezorAddress(changeEvent.target.value);
        setTrezorAddressIndex(changeEvent.target.dataset.index);
    };

    //console.log(errors);

    useEffect(() => {
        initPage(ACTION_SIGNUP);

        const invite = window.location.hash.replace('#', '');
        if (isCorrectInvite(invite)) {
            setInvite(invite);
            setMethod(SIGN_UP_INVITE);
        } else {
            setMethod(LOGIN_TREZOR);
        }
        //setMethod(SIGN_UP_INVITE);
    }, []);

    const onSubmit = async data => {
        data.preventDefault();

        if (method === LOGIN_TREZOR) {
            // todo check username before interact with trezor
            handleShow();
            getTrezorAddresses().then(data => {
                setTrezorAddress(data[0].address);
                setTrezorAddressIndex(data[0].index);
            });
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
            <Modal show={show} onHide={handleClose} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Trezor address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {trezorAddresses.inProcessReceiving && <Spinner/>}

                    <div className="form-check">
                        {!trezorAddresses.inProcessReceiving && trezorAddresses.addresses.slice(0, 5).map((item, i) => {
                            return <div key={item.index}>
                                <input className="form-check-input" type="radio" name="addresses"
                                       onChange={changeTrezorAddress}
                                       value={item.address}
                                       data-index={item.index}
                                       checked={trezorAddress === item.address}/>
                                <label className="form-check-label">
                                    {item.address}
                                </label>
                            </div>;
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button disabled={!trezorAddress} variant="primary" onClick={_ => {
                        signUp(LOGIN_TREZOR, username, null, null, {
                            address: trezorAddress,
                            addressIndex: trezorAddressIndex
                        });
                        //alert(trezorAddress);
                        handleClose();
                    }}>
                        Sign up
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
                                      onChange={e => setInvite(e.target.value)}
                                      value={invite}
                        />
                    </Form.Group>

                    <Dropdown as={ButtonGroup} className="btn-block">
                        <WaitButton disabled={signup.inProcess}>
                            <Button variant="primary"
                                    type="submit"
                                    className="col-md-10"
                                    disabled={isDisabled()}
                            >Sign up with {getDropDownTitle(method)}</Button>
                        </WaitButton>

                        <Dropdown.Toggle className="" split variant="primary"
                                         id="dropdown-split-basic"/>

                        <Dropdown.Menu>
                            {dropDown.map(item => <Dropdown.Item
                                key={item.key}
                                onClick={e => onDropDownChange(item)}>{item.title}</Dropdown.Item>)}
                        </Dropdown.Menu>
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
