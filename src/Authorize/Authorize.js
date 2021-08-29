import React, {Fragment, useCallback, useEffect, useState} from 'react';
import './Authorize.css';
import {allowApp, getAppInfo, getAppSession, getLocalUsernameHash} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import WaitButton from "../Elements/WaitButton";
import Spinner from "../Elements/Spinner";

function Authorize() {
    const params = new URLSearchParams(window.location.search);

    const responseType = params.get('response_type');

    const {state: {authorizeApp}} = useStateValue();
    const {state: {sessionApp}} = useStateValue();

    const [isActionsEnabled, setIsActionsEnabled] = useState(null);
    const [clientId] = useState(params.get('client_id'));
    const [redirectUri] = useState(params.get('redirect_uri'));

    // function parseRedirectUrl(url) {
    //     //console.log(url);
    //     if (isValidRedirectURI(url)) {
    //         const result = new URL(url);
    //         result.hash = '';
    //
    //         return result;
    //     }
    //
    //     return null;
    // }

    function isValidRedirectURI(redirectUrl) {
        try {
            if (typeof redirectUrl === 'string') {
                redirectUrl = new URL(redirectUrl);
            }

            //console.log(redirectUrl);
            if (redirectUrl && redirectUrl.protocol === 'https:') {
            } else {
                throw new Error('URL without https');
            }
        } catch {
            return false;
        }

        return true;
    }

    const successReturn = (accessToken, usernameHash) => {
        window.location.replace(`${redirectUri.toString()}#access_token=${accessToken}&user_id=${usernameHash}`);
    };

    useEffect(_ => {
        getAppSession(clientId).then();
        getAppInfo(clientId).then();
    }, [clientId]);

    useEffect(_ => {
        // check is app info loaded and session not found
        if (authorizeApp.id && !sessionApp.inProcess && sessionApp.errorMessage) {
            setIsActionsEnabled(true);
        }

        if (!authorizeApp || !authorizeApp.id || !sessionApp || !sessionApp.transactionHash) {
            return;
        }

        const usernameHash = getLocalUsernameHash();
        if (Array.isArray(authorizeApp.allowedUrls) && authorizeApp.allowedUrls.includes(redirectUri)) {
            successReturn(sessionApp.transactionHash, usernameHash);
        }
    }, [sessionApp, authorizeApp, redirectUri, successReturn]);

    const onDecline = () => {
        window.location.replace(redirectUri.toString() + '#error=access_denied&error_reason=user_denied&error_description=User denied your request');
    };

    const onAllow = async () => {
        try {
            const usernameHash = getLocalUsernameHash();
            let info = await getAppSession(clientId);

            if (!info) {
                info = await allowApp(clientId);
                if (!info) {
                    console.log('Can not allow app. Empty result');
                    return;
                }
            }

            successReturn(info.transactionHash, usernameHash);
        } catch (e) {
            console.log(e);
        }
    };

    const onBack = () => {
        window.history.back();
    };

    const isValidRedirectUri = isValidRedirectURI(redirectUri);
    const isResponseType = responseType === 'id_token';
    const isUrlAllowed = authorizeApp?.allowedUrls?.includes(redirectUri);
    const isUserCanAllow = isValidRedirectUri && isResponseType && isUrlAllowed;

    return <div className="Authorize">
        {(!isUserCanAllow && !authorizeApp.isAppLoading) && <Fragment>
            {!isUrlAllowed &&
            <div className="alert alert-danger" role="alert">
                redirect_uri is not allowed by application settings
            </div>}

            {!isValidRedirectUri &&
            <div className="alert alert-danger" role="alert">
                Incorrect redirect_uri. Check if url isn't empty and
                protocol is https
            </div>}

            {!isResponseType &&
            <div className="alert alert-danger" role="alert">
                Incorrect response_type. Accepted only id_token
            </div>}
        </Fragment>}

        {authorizeApp.errorMessage &&
        <div className="alert alert-danger" role="alert">
            Error on retrieving app info: {authorizeApp.errorMessage}
        </div>}

        <h3 className="text-center">Authorization</h3>

        <div className="Authorize-info mx-auto col-sm-4">
            {!authorizeApp.isAppLoading && !authorizeApp.errorMessage && <Fragment>
                <p>ID: {authorizeApp.id}</p>
                <p>Title: {authorizeApp.title}</p>
                <p>Description: {authorizeApp.description}</p>

                {isUserCanAllow && <Fragment>
                    <WaitButton disabled={authorizeApp.isSessionCreating}>
                        <button className="btn btn-success"
                                onClick={onAllow}
                                disabled={isActionsEnabled !== true}>
                            Allow
                        </button>
                    </WaitButton>

                    <button className="btn btn-danger float-right"
                            onClick={onDecline}
                            disabled={authorizeApp.isSessionCreating || isActionsEnabled !== true}>
                        Decline
                    </button>
                </Fragment>}

                {(!isUserCanAllow || authorizeApp.errorMessage) &&
                <button className="btn btn-primary" onClick={onBack}>Back to the application</button>}

                {authorizeApp.status.length > 0 && <p className="mt-3">{authorizeApp.status}</p>}
            </Fragment>}
        </div>

        {authorizeApp.isAppLoading && <Spinner/>}
    </div>;
}

export default Authorize;
