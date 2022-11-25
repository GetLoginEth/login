import React, {useEffect, useState} from 'react';
import './DevelopersAppEdit.css';
import {editApplication, getAppsInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import {Redirect} from "react-router-dom";
import DevelopersForm from "../Developers/DevelopersForm";

export const allowedProtocols = ['https://', 'ios:', 'android:']
export function isAllUrlsAllowed(urls) {
    for(const url of urls){
        let isAllowed = false
        for(const allowed of allowedProtocols){
            if (url.startsWith(allowed)){
                isAllowed = true
            }
        }

        if (!isAllowed){
            return false
        }
    }

    return true
}

function DevelopersAppEdit({computedMatch, location}) {
    const appId = computedMatch.params.id;

    const {state: {myApps}} = useStateValue();
    const {state: {appsInfo}} = useStateValue();

    const [redirect, setRedirect] = useState(null);
    const app = appsInfo[appId];

    useEffect(_ => {
        getAppsInfo([appId]).then();
    }, [appId]);

    return <div className="DevelopersAppEdit">
        {redirect ? redirect : ''}

        <h1 className="text-center">Edit app</h1>

        {myApps.errorMessage && <div className="alert alert-danger" role="alert">
            {myApps.errorMessage}
        </div>}

        {app && <DevelopersForm onSubmit={async formData => {
            console.log(formData);
            const {id, title, description, allowedUrls, allowedContracts} = formData;
            if (!isAllUrlsAllowed(allowedUrls)) {
                alert('Allowed only https url for allowed URLs. Please fix it and try again');
                return;
            }

            await editApplication(id, title, description, allowedUrls, allowedContracts);
            setRedirect(<Redirect to={{pathname: "./developers", state: {from: location}}}/>);
        }} initValues={app} isFormDisabled={myApps.inProcessEditing} isWaitButton={myApps.inProcessEditing}/>}
    </div>;
}

export default DevelopersAppEdit;
