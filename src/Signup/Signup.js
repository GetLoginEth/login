import React, {useState} from 'react';
import './Signup.css';
import Button from "react-bootstrap/Button";
import {signUp} from "../reducers/actions";
import Form from "react-bootstrap/Form";

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [invite, setInvite] = useState('');
    const isCorrectInvite = () => {
        return invite.length === 32;
    };
    const isDisabled = () => {
        return username.length < 3 || password.length < 3 || (invite.length > 0 && !isCorrectInvite());
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

                <Form.Group controlId="formInvite">
                    <Form.Control type="text" placeholder="Invite" onChange={e => setInvite(e.target.value)}
                                  value={invite}/>
                </Form.Group>

                <Button className="btn-block"
                        disabled={isDisabled()}
                        onClick={() => signUp(username, password, invite)}>
                    Sign up
                </Button>
            </Form>
        </div>
    );
}

export default Signup;
