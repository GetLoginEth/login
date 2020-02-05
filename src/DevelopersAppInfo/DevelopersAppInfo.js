import React, {useEffect} from 'react';
import './DevelopersAppInfo.css';
import {getMyApps} from "../reducers/actions";
import {useStateValue} from "../reducers/state";

function DevelopersAppInfo() {
    const {state: {myApps}} = useStateValue();

    useEffect(_ => {
        getMyApps().then();
    }, []);
    return <div className="DevelopersAppInfo">
        <h1 className="text-center">App info</h1>
        Hello app
    </div>;
}

export default DevelopersAppInfo;
