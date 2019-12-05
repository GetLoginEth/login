import React, {useState} from 'react';
import './LoginForm.css';
//import {useHistory, useLocation} from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {signIn} from "../reducers/actions";
import {SIGN_IN_USERNAME_PASSWORD} from "../Lib/get-login/signin";
import {useStateValue} from "../reducers/state";

/*const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};*/

/*function AuthButton() {
    let history = useHistory();

    return fakeAuth.isAuthenticated ? (
        <p>
            Welcome!{" "}
            <button
                onClick={() => {
                    fakeAuth.signout(() => history.push("/"));
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}*/

function LoginForm() {
    const {state: {signin}} = useStateValue();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isDisabled = () => {
        return username.length < 3 || password.length < 3
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
            <Form className="LoginForm col-md-4">
                <fieldset disabled={signin.inProcess}>
                    <h1>Sign in</h1>

                    <Form.Group controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Username" onChange={e => setUsername(e.target.value)}
                                      value={username}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}
                                      value={password}/>
                    </Form.Group>

                    <Button className="btn-block"
                            disabled={isDisabled()}
                            onClick={() => signIn(SIGN_IN_USERNAME_PASSWORD, username, password)}>
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

export default LoginForm;
