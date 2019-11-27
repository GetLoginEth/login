import React from 'react';
import './Logout.css';
import Button from "react-bootstrap/Button";
import {logoutLocal} from "../reducers/actions";

function Logout() {
    return (
        <div className="row justify-content-center align-items-center">
            <div>
                <h1>Really logout?</h1>

                <Button className="btn-danger" onClick={logoutLocal}>Yes</Button>
            </div>
        </div>
    );
}

export default Logout;
