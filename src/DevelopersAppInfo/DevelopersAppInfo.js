import React, {useEffect} from 'react';
import './DevelopersAppInfo.css';
import {getAppsInfo} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import Spinner from "../Elements/Spinner";
import DevelopersForm from "../Developers/DevelopersForm";

function DevelopersAppInfo({computedMatch}) {
    const appId = computedMatch.params.id;
    const {state: {appsInfo}} = useStateValue();
    const app = appsInfo[appId];

    useEffect(_ => {
        getAppsInfo([appId]).then();
    }, [appId]);


    return <div className="DevelopersAppInfo">
        <h1 className="text-center">App info</h1>
        {!app && <Spinner/>}
        {app && <DevelopersForm isFormDisabled={true} initValues={app} isShowSaveButton={false}/>}
    </div>;
}

export default DevelopersAppInfo;
