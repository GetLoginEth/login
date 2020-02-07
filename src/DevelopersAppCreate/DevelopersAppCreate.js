import React, {useEffect, useState} from 'react';
import './DevelopersAppCreate.css';
import {createApplication} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import WaitButton from "../Elements/WaitButton";
import {Redirect} from "react-router-dom";

function DevelopersAppCreate({location}) {
    const {state: {myApps}} = useStateValue();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowedUrls, setAllowedUrls] = useState('');
    const [allowedSmartContracts, setAllowedSmartContracts] = useState('');
    const [redirect, setRedirect] = useState(null);

    useEffect(_ => {
        //getAppsInfo([appId]).then();
    }, []);

    const isSaveDisabled = () => {
        return !title || !description || !allowedUrls || !allowedSmartContracts;
    };

    // todo after creation and redirect display info about tx mining
    return <div className="DevelopersAppCreate">
        {redirect ? redirect : ''}
        <h1 className="text-center">Create new app</h1>
        {myApps.errorMessage && <div className="alert alert-danger" role="alert">
            {myApps.errorMessage}
        </div>}
        <form onSubmit={e => {
            e.preventDefault();
            createApplication(title, description, allowedUrls.split("\n"), allowedSmartContracts.split("\n"))
                .then(data => {
                    if (data) {
                        setRedirect(<Redirect to={{pathname: "./developers", state: {from: location}}}/>);
                    }
                });
        }}>
            <fieldset disabled={myApps.inProcessCreation}>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" className="form-control" id="title" placeholder="Title" value={title}
                           onChange={e => setTitle(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" rows="3" placeholder="Description"
                              value={description}
                              onChange={e => setDescription(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="allowedUrls">Allowed URLs (each on a new line)</label>
                    <textarea className="form-control" id="allowedUrls" rows="3"
                              placeholder="Allowed URLs (each on a new line)" value={allowedUrls}
                              onChange={e => setAllowedUrls(e.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="allowedSmartContracts">Allowed smart contracts (each on a new line)</label>
                    <textarea className="form-control" id="allowedSmartContracts" rows="3"
                              placeholder="Allowed smart contracts (each on a new line)" value={allowedSmartContracts}
                              onChange={e => setAllowedSmartContracts(e.target.value)}/>
                </div>

                <WaitButton disabled={myApps.inProcessCreation}>
                    <button disabled={isSaveDisabled()} className="btn btn-success" type="submit">Create</button>
                </WaitButton>
            </fieldset>
        </form>
    </div>;
}

export default DevelopersAppCreate;
