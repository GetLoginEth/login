import React, {useEffect, useState} from 'react';
import './Signin.css';
//import {useHistory, useLocation} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {initPage, signIn} from "../reducers/actions";
import {LOGIN_USERNAME_PASSWORD} from "../Lib/get-login/signin";
import {useStateValue} from "../reducers/state";
import {Link} from "react-router-dom";
import {validatePassword, validateUsername} from "../Lib/get-login/utils";
import {ACTION_SIGNIN} from "../reducers/mainReducer";

function Signin() {
    const {state: {signin}} = useStateValue();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        initPage(ACTION_SIGNIN);
    }, []);

    const isDisabled = () => {
        let result = true;
        try {
            validateUsername(username);
            validatePassword(password);
            result = false;
        } catch (e) {

        }

        return result;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        signIn(LOGIN_USERNAME_PASSWORD, username, password).then();
    };
    /*let history = useHistory();
    let location = useLocation();

    let {from} = location.state || {from: {pathname: "/"}};
    let login = () => {
        fakeAuth.authenticate(() => {
            history.replace(from);
        });
    };*/

    return (
        <div className="row justify-content-center align-items-center">
            <Form className="Signin col-md-4" onSubmit={onSubmit}>
                <fieldset disabled={signin.inProcess}>
                    <h1>Sign in / <Link to="./xsignup">Sign up</Link></h1>

                    {signin.errorMessage && <div className="alert alert-danger" role="alert">
                        {signin.errorMessage}
                    </div>}

                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}
                                      value={username}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}
                                      value={password}/>
                    </Form.Group>

                    <Button className="btn-block"
                            type="submit"
                            disabled={isDisabled()}>
                        {signin.inProcess &&
                        <span className="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"/>}
                        Sign in
                    </Button>
                    {signin.log.length > 0 && <details className="mt-2">
                        <summary>{signin.status}</summary>
                        {signin.log.map((item, index) => <p key={index}>{item}</p>)}
                    </details>}
                </fieldset>
            </Form>
        </div>
    );
}

export default Signin;
