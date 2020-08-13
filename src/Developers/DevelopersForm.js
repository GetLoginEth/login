import React, {useEffect, useState} from 'react';
import WaitButton from "../Elements/WaitButton";

function DevelopersForm({isFormDisabled = false, onSubmit = null, redirect = null, initValues = {}, isWaitButton = false, isShowSaveButton = true}) {
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [allowedUrls, setAllowedUrls] = useState('');
    const [allowedContracts, setAllowedContracts] = useState('');

    useEffect(_ => {
        if (initValues.title) {
            if (initValues.id) {
                setId(initValues.id);
            }

            setTitle(initValues.title);
            setDescription(initValues.description);
            setAllowedUrls(initValues.allowedUrls.join("\n"));
            setAllowedContracts(initValues.allowedContracts.join("\n"));
        }
    }, [initValues]);

    const isSaveDisabled = () => {
        return !title || !description || !allowedUrls || !allowedContracts;
    };

    //console.log(initValues);

    // todo after creation and redirect display info about tx mining
    return <form onSubmit={e => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit({
                id,
                title,
                description,
                allowedUrls: allowedUrls.split("\n"),
                allowedContracts: allowedContracts.split("\n")
            });
        }
    }}>
        {redirect ? redirect : ''}
        <fieldset disabled={isFormDisabled}>
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
                          placeholder="Allowed smart contracts (each on a new line)" value={allowedContracts}
                          onChange={e => setAllowedContracts(e.target.value)}/>
            </div>

            {isShowSaveButton && <WaitButton disabled={isWaitButton}>
                <button disabled={isSaveDisabled()} className="btn btn-success" type="submit">Save</button>
            </WaitButton>}
        </fieldset>
    </form>;
}

export default DevelopersForm;
