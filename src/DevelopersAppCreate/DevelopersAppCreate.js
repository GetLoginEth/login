import React, {useEffect, useState} from 'react';
import './DevelopersAppCreate.css';
import {createApplication} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import {Redirect} from "react-router-dom";
import DevelopersForm from "../Developers/DevelopersForm";

function DevelopersAppCreate({location}) {
    const {state: {myApps}} = useStateValue();

    const [redirect, setRedirect] = useState(null);

    useEffect(_ => {
        //getAppsInfo([appId]).then();
    }, []);

    // todo after creation and redirect display info about tx mining
    return <div className="DevelopersAppCreate">
        {redirect ? redirect : ''}
        <h1 className="text-center">Create new app</h1>
        {myApps.errorMessage && <div className="alert alert-danger" role="alert">
            {myApps.errorMessage}
        </div>}

        <DevelopersForm onSubmit={formData => {
            console.log(formData);
            const {title, description, allowedUrls, allowedContracts} = formData;
            createApplication(title, description, allowedUrls, allowedContracts)
                .then(data => {
                    if (data) {
                        setRedirect(<Redirect to={{pathname: "./developers", state: {from: location}}}/>);
                    }
                });
        }} isWaitButton={myApps.inProcessCreation} isFormDisabled={myApps.inProcessCreation}/>
    </div>;
}

export default DevelopersAppCreate;
