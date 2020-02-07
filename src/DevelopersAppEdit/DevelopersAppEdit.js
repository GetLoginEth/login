import React, {useEffect, useState} from 'react';
import './DevelopersAppEdit.css';
import {createApplication, editApplication, getAppsInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import WaitButton from "../Elements/WaitButton";
import {Redirect} from "react-router-dom";
import DevelopersForm from "../Developers/DevelopersForm";

function DevelopersAppEdit({computedMatch, location}) {
    const appId = computedMatch.params.id;

    const {state: {myApps}} = useStateValue();
    const {state: {appsInfo}} = useStateValue();

    const [redirect, setRedirect] = useState(null);
    const app = appsInfo[appId];

    useEffect(_ => {
        getAppsInfo([appId]).then();
    }, []);

    return <div className="DevelopersAppEdit">
        {redirect ? redirect : ''}
        <h1 className="text-center">Edit app</h1>
        {myApps.errorMessage && <div className="alert alert-danger" role="alert">
            {myApps.errorMessage}
        </div>}
        {app && <DevelopersForm onSubmit={formData => {
            console.log(formData);
            const {id, title, description, allowedUrls, allowedContracts} = formData;
            editApplication(id, title, description, allowedUrls, allowedContracts)
                .then(data => {
                    setRedirect(<Redirect to={{pathname: "./developers", state: {from: location}}}/>);
                });
        }} initValues={app}/>}
    </div>;
}

export default DevelopersAppEdit;
