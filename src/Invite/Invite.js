import React, {Fragment, useEffect, useState} from 'react';
import './Invite.css';
import {useStateValue} from "../reducers/state";
import {createInvite, getInvite, getInvitePrice, getInvites} from "../reducers/actions";
import WaitButton from "../Elements/WaitButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import {beautyBalance} from "../Lib/get-login/utils";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

function Invite() {
    const [showMultipleModal, setShowMultipleModal] = useState(false);
    const [invitesCount, setInvitesCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [additionalBalanceEth, setAdditionalBalanceEth] = useState('0');
    const [additionalBalanceBzz, setAdditionalBalanceBzz] = useState('0');

    const {state: {app}} = useStateValue();
    const {state: {user}} = useStateValue();
    const {state: {invite}} = useStateValue();
    const {state: {invite: {inviteInfo}}} = useStateValue();

    const invitesPerPage = 10;

    const inviteTotalPrice = Number(invite.priceTotal) + Number(additionalBalanceEth);
    const inviteTotalPriceWeb = beautyBalance(inviteTotalPrice, 4);

    useEffect(_ => {
        getInvitePrice().then();
        getInvites(user.usernameHash).then();
    }, [user.usernameHash]);

    // todo get invite min value from global state
    const isCanCreateInvite = invite.priceTotal ? Number(user.balance.original) >= Number(invite.priceTotal) : false;
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

        {user.balance.original !== null && invite.priceTotal > 0 && !isCanCreateInvite &&
        <p>Your balance must be more than <strong>{inviteTotalPriceWeb} {app.currency}</strong> to create invite</p>}

        {isCanCreateInvite && invite.priceTotal > 0 &&
        <div>
            <p>
                Will be spent ~
                <OverlayTrigger
                    placement="right"
                    delay={{show: 250, hide: 400}}
                    overlay={<Tooltip id="button-tooltip">
                        Creation: {invite.priceCreationWeb} {app.currency}<br/>
                        Invitee signup: {invite.priceSignupWeb} {app.currency}<br/>
                        Basic spends: {invite.priceBasicSpendsWeb} {app.currency}<br/>
                        Additional spends: {additionalBalanceEth} {app.currency}<br/>
                        {additionalBalanceBzz} {app.bzz.name}
                    </Tooltip>}
                >
                    <strong>{inviteTotalPriceWeb} {app.currency}</strong>
                </OverlayTrigger>
            </p>

            <label>Additional spends for invite</label>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">{app.currency}</span>
                </div>
                <input type="text" className="form-control"
                       value={additionalBalanceEth}
                       onChange={e => {
                           const value = parseFloat(e.target.value);
                           if (!isNaN(value) && value >= 0) {
                               setAdditionalBalanceEth(e.target.value);
                           } else {
                               setAdditionalBalanceEth('0');
                           }
                       }}/>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text">{app.bzz.name}</span>
                </div>
                <input type="text" className="form-control"
                       value={additionalBalanceBzz}
                       onChange={e => {
                           const value = parseFloat(e.target.value);
                           if (!isNaN(value) && value >= 0) {
                               setAdditionalBalanceBzz(e.target.value);
                           } else {
                               setAdditionalBalanceBzz('0');
                           }
                       }}/>
            </div>
        </div>
        }

        <Dropdown as={ButtonGroup} className="btn-block col-md-3" style={{padding: 0}}>
            <WaitButton disabled={invite.inProcessCreation}>
                <Button variant="primary"
                        type="submit"
                        className={"col-md-10"}
                        disabled={!isCanCreateInvite}
                        onClick={_ => {
                            const message = additionalBalanceBzz > 0 ?
                                `Really create? ${inviteTotalPriceWeb} ${app.currency} + ${additionalBalanceBzz} ${app.bzz.name} will be spent`
                                : `Really create? ${inviteTotalPriceWeb} ${app.currency} will be spent`;
                            if (window.confirm(message)) {
                                createInvite(inviteTotalPrice, additionalBalanceBzz).then();
                            }
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
