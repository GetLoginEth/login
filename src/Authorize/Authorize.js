import React, {Fragment, useEffect, useState} from 'react';
import './Authorize.css';
import {allowApp, getAllowedApp, getAppInfo, getLocalUsernameHash} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import WaitButton from "../Elements/WaitButton";
import Spinner from "../Elements/Spinner";

function Authorize() {
    //const [isShowForm, setIsShowForm] = useState(false);

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
        // todo check is not equal current page and other cases
        // todo compare with allowed urls in blockchain

        try {
            if (typeof redirectUrl === 'string') {
                redirectUrl = new URL(redirectUrl);
            }

            //console.log(redirectUrl);
            if (redirectUrl && redirectUrl.protocol === 'https:') {
            } else {
                throw new Error();
            }
        } catch {
            return false;
        }

        return true;
    };

    const isValidResponseType = (responseType) => {
        return responseType === 'id_token';
    };

    const {state: {authorizeApp}} = useStateValue();
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
        const check = async () => {
            await getAppInfo(clientId);
        };
        check().then();
    }, [clientId]);

    useEffect(_ => {
        const check = async () => {
            //setIsShowForm(false);
            if (!authorizeApp.id) {
                return;
            }

            const info = await getAllowedApp(clientId);
            //console.log(info);

            if (!info) {
                return;
            }

            const usernameHash = getLocalUsernameHash();
            if (Array.isArray(authorizeApp.allowedUrls) && authorizeApp.allowedUrls.includes(redirectUri.href)) {
                successReturn(info.transactionHash, usernameHash);
            } else {
                //setIsShowForm(true);
            }
        };
        check().then();
    }, [clientId, authorizeApp, redirectUri]);

    const onDecline = () => {
        window.location.replace(redirectUri.toString() + '#error=access_denied&error_reason=user_denied&error_description=User denied your request');
    };

    const onAllow = async () => {
        try {
            const usernameHash = getLocalUsernameHash();
            let info = await getAllowedApp(clientId);

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
    const isUrlAllowed = authorizeApp.allowedUrls.includes(redirectUri.href);

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
