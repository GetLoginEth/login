import React, {useEffect} from 'react';
import './Developers.css';
import {getMyApps} from "../reducers/actions";
import {useStateValue} from "../reducers/state";
import Spinner from "../Elements/Spinner";
import {Link} from "react-router-dom";

function Developers() {
    const {state: {myApps}} = useStateValue();

    useEffect(_ => {
        getMyApps().then();
    }, []);
    return <div className="Developers">
        <h1 className="text-center">Developers portal</h1>
        {myApps.inProcessReceiving && (!myApps.apps || myApps.apps.length === 0) && <Spinner/>}

        {myApps.apps && myApps.apps.length > 0 &&
        <table className="table table-bordered">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Urls</th>
                <th scope="col">Contracts</th>
                <th scope="col">Actions</th>
            </tr>
            </thead>
            <tbody>

            {myApps.apps.map((item, i) => {
                return <tr key={i}>
                    <th scope="row">{item.returnValues.appId}</th>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td>
                        <Link to={`./developers-${item.returnValues.appId}`} className="btn btn-primary">View</Link>
                    </td>
                </tr>
            })}

            </tbody>
        </table>
        }
    </div>;
}

export default Developers;
