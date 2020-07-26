import React from 'react';
import './Logout.css';
import {logoutLocal} from "../reducers/actions";

function Logout() {
    return (
        <div className=" " id="logoutModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel"
             aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                        {/*<button className="close" type="button" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>*/}
                    </div>
                    <div className="modal-body">Select "Logout" below if you are ready to clear your local session.
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" type="button" data-dismiss="modal" onClick={_ => {
                            window.history.back();
                        }}>
                            Cancel
                        </button>
                        <button className="btn btn-primary" type="button" data-dismiss="modal" onClick={e => {
                            e.preventDefault();
                            logoutLocal().then();
                        }}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Logout;
