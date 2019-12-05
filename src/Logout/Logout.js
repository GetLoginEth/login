import React from 'react';
import './Logout.css';
import Button from "react-bootstrap/Button";
import {logoutLocal} from "../reducers/actions";

function Logout() {
    return (
        <div className="row justify-content-center align-items-center">
            <div className="border rounded p-4">
                <h3>Really logout?</h3>
                <p className="text-muted"><small>Clear local data from your browser</small></p>
                <Button className="btn-danger mr-1" onClick={logoutLocal} role="button">Yes</Button>
                <Button className="btn-secondary" onClick={() => window.history.back()} role="button">No</Button>
            </div>
        </div>
    );
}

export default Logout;
