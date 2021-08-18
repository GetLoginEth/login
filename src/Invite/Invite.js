import React, {Fragment, useEffect, useState} from 'react';
import './Invite.css';
import {useStateValue} from "../reducers/state";
import {createInvite, getInvite, getInvitePrice, getInvites} from "../reducers/actions";
import WaitButton from "../Elements/WaitButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";

function Invite() {
    const [showMultipleModal, setShowMultipleModal] = useState(false);
    const [invitesCount, setInvitesCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const {state: {app}} = useStateValue();
    const {state: {user}} = useStateValue();
    const {state: {invite}} = useStateValue();
    const {state: {invite: {inviteInfo}}} = useStateValue();

    const invitesPerPage = 10;

    useEffect(_ => {
        getInvitePrice().then();
        getInvites(user.usernameHash).then();
    }, [user.usernameHash]);

    // todo get invite min value from global state
    const isCanCreateInvite = invite.price ? Number(user.balance.original) >= Number(invite.price) : false;
    const pagesCount = Math.ceil(invite.invites.length / invitesPerPage);
    const paginationPosition = (currentPage - 1) * invitesPerPage;
    const paginationOffset = paginationPosition + invitesPerPage;
    const filteredInvites = invite.invites.slice(paginationPosition, paginationOffset);

    return <Fragment>
        <h1>Invites</h1>

        {invite.errorMessage && <div className="alert alert-danger" role="alert">
            {invite.errorMessage}
        </div>}

        <Modal id="multipleModal"
               show={showMultipleModal}
               onHide={_ => {
                   setShowMultipleModal(false);
               }} animation={true}>
            <Modal.Header>
                <Modal.Title>Multiple invites</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Invites count</label>
                    <input type="number" className="form-control" value={invitesCount}
                           onChange={e => {
                               setInvitesCount(Number(e.target.value));
                           }}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={invite.inProcessCreation} variant="secondary" onClick={_ => {
                    setShowMultipleModal(false);
                }}>
                    Cancel
                </Button>
                <Button disabled={invite.inProcessCreation} variant="primary" onClick={_ => {
                    createInvite(invitesCount).then();
                    setShowMultipleModal(false);
                }}>
                    Create invites
                </Button>
            </Modal.Footer>
        </Modal>

        {user.balance.original !== null && invite.price > 0 && !isCanCreateInvite &&
        <p>Your balance must be more than {invite.priceWeb} {app.currency} to create invite</p>}
        {isCanCreateInvite && invite.price > 0 && <p>Invite creation cost {invite.priceWeb} {app.currency}</p>}

        <Dropdown as={ButtonGroup} className="btn-block col-md-3" style={{padding: 0}}>
            <WaitButton disabled={invite.inProcessCreation}>
                <Button variant="primary"
                        type="submit"
                        className={"col-md-10"}
                        disabled={!isCanCreateInvite}
                        onClick={_ => {
                            createInvite(1).then();
                        }}
                >
                    Create invite
                </Button>
            </WaitButton>

            {/*<Dropdown.Toggle className="" split variant="primary"
                             disabled={!isCanCreateInvite || invite.inProcessCreation}/>

            <Dropdown.Menu>
                <Dropdown.Item onClick={e => {
                    //createInvite(5, invite.price).then();
                    alert('Not implemented');
                }}>Create multiple</Dropdown.Item>
            </Dropdown.Menu>*/}
        </Dropdown>

        {invite.createdInvites.length > 0 && <div className="mt-3">
            <h4>Created invites</h4>
            <small>You can send these invites for new users</small>
            {invite.createdInvites.map((item, index) => {
                return <p key={index}><span style={{color: 'green'}}>{item.privateKey.replace('0x', '')}</span><br/>
                    <small
                        style={{color: 'grey'}}>Public
                        address: {item.address}</small></p>
            })}
        </div>}

        {filteredInvites.length > 0 && <div className="mt-3">
            <h4>Previously created invites</h4>
            <small>There are public addresses. You can not use it as invites</small>

            <table className="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">Address</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>

                {filteredInvites.map((item, index) => {
                    const inviteAddress = item.returnValues.inviteAddress;
                    const info = inviteInfo[inviteAddress];

                    return <tr key={index}>
                        <td>
                            {item.returnValues.inviteAddress} <span
                            className="mr-2">{info && (info.isActive ? '/ Active' : '/ Used')}</span>
                        </td>
                        <td>
                            <button className="btn btn-secondary btn-sm" onClick={_ => {
                                getInvite(item.returnValues.inviteAddress).then();
                            }}>
                                Check
                            </button>
                        </td>
                    </tr>;
                })}

                </tbody>
            </table>

            <nav aria-label="Page navigation">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" aria-label="Previous" onClick={_ => {
                            setCurrentPage(1)
                        }}>
                            <span aria-hidden="true">&laquo;</span>
                        </button>
                    </li>
                    {[...Array(pagesCount).keys()].map((i, key) =>
                        <li key={key} className={`page-item ${currentPage === (i + 1) ? 'active' : ''}`}>
                            <button className="page-link" onClick={_ => {
                                setCurrentPage(i + 1)
                            }}>{i + 1}</button>
                        </li>
                    )}

                    <li className={`page-item ${currentPage === pagesCount ? 'disabled' : ''}`}>
                        <button className="page-link" aria-label="Next" onClick={_ => {
                            setCurrentPage(pagesCount)
                        }}>
                            <span aria-hidden="true">&raquo;</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>}
    </Fragment>;
}

export default Invite;
