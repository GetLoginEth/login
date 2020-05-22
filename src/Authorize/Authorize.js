import React, {Fragment, useEffect, useState} from 'react';
import './Authorize.css';
import {allowApp, getAppSession, getAppInfo, getLocalUsernameHash} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import WaitButton from "../Elements/WaitButton";
import Spinner from "../Elements/Spinner";

function Authorize() {
    const {state: {authorizeApp}} = useStateValue();
    const {state: {sessionApp}} = useStateValue();

    const setRedirectUrl = (url) => {
        //console.log(url);
        if (isValidRedirectURI(url)) {
            const result = new URL(url);
            result.hash = '';

            return result;
        }

        return null;
    };

    const isValidRedirectURI = (redirectUrl) => {
        try {
            if (typeof redirectUrl === 'string') {
                redirectUrl = new URL(redirectUrl);
            }

            //console.log(redirectUrl);
            if (redirectUrl && redirectUrl.protocol === 'https:') {
            } else {
                throw new Error('url without https');
            }
        } catch {
            return false;
        }

        return true;
    };

    const isValidResponseType = (responseType) => {
        return responseType === 'id_token';
    };

    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('client_id');
    /**
     *
     * @type {URL | null}
     */
    const redirectUri = setRedirectUrl(params.get('redirect_uri'));
    const responseType = params.get('response_type');

    const successReturn = (accessToken, usernameHash) => {
        window.location.replace(`${redirectUri.toString()}#access_token=${accessToken}&user_id=${usernameHash}`);
    };

    useEffect(_ => {
        getAppSession(clientId).then();
        getAppInfo(clientId).then();
    }, [clientId]);

    useEffect(_ => {
        if (!authorizeApp || !authorizeApp.id || !sessionApp || !sessionApp.transactionHash) {
            return;
        }

        const usernameHash = getLocalUsernameHash();
        if (Array.isArray(authorizeApp.allowedUrls) && authorizeApp.allowedUrls.includes(redirectUri.href)) {
            successReturn(sessionApp.transactionHash, usernameHash);
        } else {
            //setIsShowForm(true);
        }
    }, [sessionApp, authorizeApp]);

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

    const isRedirectUri = isValidRedirectURI(redirectUri);
    const isResponseType = isValidResponseType(responseType);
    const isValidParams = isRedirectUri && isResponseType;
    const isUrlAllowed = isRedirectUri ? authorizeApp.allowedUrls.includes(redirectUri.href) : false;


    return <div className="Authorize">
        <h3 className="text-center">Authorization</h3>

        <div className="Authorize-info mx-auto col-sm-4">
            {authorizeApp.errorMessage && <div className="text-center">
                <p>Error on retrieving app info: {authorizeApp.errorMessage}</p>
                <button className="btn btn-primary" onClick={onBack}>Back</button>
            </div>}

            {!authorizeApp.isAppLoading && !authorizeApp.errorMessage && <Fragment>
                <p>ID: {authorizeApp.id}</p>
                <p>Title: {authorizeApp.title}</p>
                <p>Description: {authorizeApp.description}</p>

                {isValidParams && isUrlAllowed && <Fragment>
                    <WaitButton disabled={authorizeApp.isSessionCreating}>
                        <button className="btn btn-success" onClick={onAllow}>
                            Allow
                        </button>
                    </WaitButton>

                    <button className="btn btn-danger float-right" onClick={onDecline}
                            disabled={authorizeApp.isSessionCreating}>
                        Decline
                    </button>
                </Fragment>}

                {(!isValidParams || !isUrlAllowed) && <Fragment>
                    {!isUrlAllowed &&
                    <p className="text-danger">redirect_uri is not allowed by application.</p>}

                    {!isRedirectUri &&
                    <p className="text-danger">Application passed incorrect redirect_uri.</p>}

                    {!isResponseType &&
                    <p className="text-danger">Application passed incorrect response_type. Accepted only id_token. </p>}

                    <p>You can go back to the application.</p>

                    <button className="btn btn-primary" onClick={onBack}>Back</button>
                </Fragment>}

                {authorizeApp.status.length > 0 && <p className="mt-3">{authorizeApp.status}</p>}
            </Fragment>}
        </div>

        {authorizeApp.isAppLoading && <Spinner/>}
    </div>;
}

export default Authorize;
