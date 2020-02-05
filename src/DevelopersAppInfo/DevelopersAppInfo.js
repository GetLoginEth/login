import React, {Fragment, useEffect} from 'react';
import './DevelopersAppInfo.css';
import {getAppsInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import Spinner from "../Elements/Spinner";

function DevelopersAppInfo({computedMatch}) {
    const appId = computedMatch.params.id;
    const {state: {myApps}} = useStateValue();
    const {state: {appsInfo}} = useStateValue();

    useEffect(_ => {
        getAppsInfo([appId]).then();
    }, []);

    const app = appsInfo[appId];
    return <div className="DevelopersAppInfo">
        <h1 className="text-center">App info</h1>
        {!app && <Spinner/>}
        {app && <Fragment>
            <p>ID: {app.id}</p>
            <p>Title: {app.title}</p>
            <p>Description: {app.description}</p>
            <p>URLs: {app.allowedUrls.map((item, i) => <span key={i}>{item}<br/></span>)}</p>
            <p>Contracts: {app.allowedContracts.map((item, i) => <span key={i}>{item}<br/></span>)}</p>
            <p>Is active: {app.isActive.toString()}</p>
        </Fragment>}
    </div>;
}

export default DevelopersAppInfo;
