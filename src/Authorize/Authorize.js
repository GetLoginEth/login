import React, {Fragment, useEffect} from 'react';
import './Authorize.css';
import {allowApp, getAllowedApp, getAppInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";

function Authorize() {
    const setRedirectUrl = (url) => {
        console.log(url);
        if (isValidRedirectURL(url)) {
            const result = new URL(url);
            result.hash = '';

            return result;
        }

        return null;
    };

    const isValidRedirectURL = (redirectUrl) => {
        // todo check is not equal current page and other cases
        // todo compare with allowed urls in blockchain

        try {
            if (typeof redirectUrl === 'string') {
                redirectUrl = new URL(redirectUrl);
            }

            console.log(redirectUrl);
            if (redirectUrl && redirectUrl.protocol === 'https:') {
            } else {
                throw new Error();
            }
        } catch {
            return false;
        }

        return true;
    };

    const {state: {authorizeApp}} = useStateValue();
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('client_id');
    /**
     *
     * @type {URL | null}
     */
    const redirectUrl = setRedirectUrl(params.get('redirect_url'));

    const successReturn = (accessToken, usernameHash) => {
        window.location.replace(`${redirectUrl.toString()}#access_token=${accessToken}&user_id=${usernameHash}`);
    };

    useEffect(_ => {
        getAppInfo(clientId).then();
        getAllowedApp(clientId)
            .then(accessToken => {
                if(accessToken){
                    successReturn(accessToken, 'some_username_hash');
                }
            });
    }, [clientId]);

    const onDecline = () => {
        window.location.replace(redirectUrl.toString() + '#error=access_denied&error_reason=user_denied&error_description=User denied your request');
    };

    const onAllow = () => {
        // todo check is already exists token. return old token
        const accessToken = 'accessToken_66666';
        // todo get real username hash
        const usernameHash = 'usernameHash_sge4g34g34g34';
        allowApp(clientId, accessToken).then(result => {
            successReturn(accessToken, usernameHash);
        });
    };

    const onBack = () => {
        window.history.back();
    };

    const isValidURL = isValidRedirectURL(redirectUrl);
    return <div className="Authorize">
        <h3 className="text-center">Authorization</h3>

        <div className="Authorize-info mx-auto col-sm-4">
            {authorizeApp.errorMessage && <div className="text-center">
                <p>Error on retrieving app info: {authorizeApp.errorMessage}</p>
                <button className="btn btn-primary" onClick={onBack}>Back</button>
            </div>}

            {!authorizeApp.inProcess && !authorizeApp.errorMessage && <Fragment>
                <p>ID: {authorizeApp.id}</p>
                <p>Title: {authorizeApp.title}</p>
                <p>Description: {authorizeApp.description}</p>
                <p>Redirect URL not checked</p>

                {isValidURL && <Fragment>
                    <button className="btn btn-success" onClick={onAllow} disabled={!isValidURL}>Allow
                    </button>
                    <button className="btn btn-danger float-right" onClick={onDecline}
                            disabled={!isValidURL}>Decline
                    </button>
                </Fragment>}

                {!isValidURL && <Fragment>
                    <p className="text-danger">Application passed incorrect redirect_url. You can go back to the
                        application.</p>
                    <button className="btn btn-primary" onClick={onBack}>Back</button>
                </Fragment>}
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
