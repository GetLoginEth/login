import React, {Fragment, useEffect} from 'react';
import './Authorize.css';
import {getAppInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";

function Authorize() {
    const {state: {authorizeApp}} = useStateValue();
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('client_id');
    const redirectUrl = params.get('redirect_url');

    useEffect(_ => {
        getAppInfo(clientId).then();
    }, []);

    const onDecline = () => {

    };

    const onAllow = () => {

    };

    return <div className="Authorize">
        <h3 className="text-center">Authorization</h3>

        <div className="Authorize-info mx-auto col-sm-4">
            {authorizeApp.errorMessage && <div>
                <p>Error on retrieving app info: {authorizeApp.errorMessage}</p>
            </div>}

            {!authorizeApp.inProcess && !authorizeApp.errorMessage && <Fragment>
                <p>ID: {authorizeApp.id}</p>
                <p>Title: {authorizeApp.title}</p>
                <p>Description: {authorizeApp.description}</p>
                <p>Redirect URL not checked</p>

                <button className="btn btn-success" onClick={onAllow}>Allow</button>
                <button className="btn btn-danger float-right" onClick={onDecline}>Decline</button>
            </Fragment>}
        </div>

        {authorizeApp.inProcess && <div className="App-loading text-center">
            <div className="spinner-border text-success" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>}
    </div>;
}

export default Authorize;
