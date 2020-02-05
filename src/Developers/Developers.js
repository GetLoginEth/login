import React, {useEffect} from 'react';
import './Developers.css';
import {getAppsInfo, getMyApps} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import Spinner from "../Elements/Spinner";
import {Link} from "react-router-dom";

function Developers() {
    const {state: {myApps}} = useStateValue();
    const {state: {appsInfo}} = useStateValue();

    useEffect(_ => {
        getMyApps().then(data => {
            const ids = data.map(item => item.returnValues.appId);
            getAppsInfo(ids).then();
        });
    }, []);

    console.log(appsInfo);
    return <div className="Developers">
        <h1 className="text-center">Developers portal</h1>
        <Link className="btn btn-primary mb-3" to="./developers-create">Create new app</Link>
        {myApps.inProcessReceiving && (!myApps.apps || myApps.apps.length === 0) && <Spinner/>}

        {myApps.apps && myApps.apps.length > 0 &&
        <table className="table table-bordered">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>

            {myApps.apps.map((item, i) => {
                const appId = item.returnValues.appId;
                return <tr key={i}>
                    <th scope="row">{appId}</th>
                    <td>{appsInfo[appId] ? appsInfo[appId].title : '...'}</td>
                    <td>{appsInfo[appId] ? appsInfo[appId].description : '...'}</td>
                    <td>
                        <Link to={`./developers-${item.returnValues.appId}`} className="btn btn-info btn-sm">View</Link>
                    </td>
                </tr>
            })}

            </tbody>
        </table>
        }
    </div>;
}

export default Developers;
