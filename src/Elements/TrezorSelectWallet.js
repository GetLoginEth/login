import React, {useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import Spinner from "./Spinner";
import Button from "react-bootstrap/Button";
import {useStateValue} from "../reducers/state";
import {setAddressIndex} from "../reducers/actions";

function TrezorSelectWallet({id, isShow, onClose, onComplete, completeText = 'Save'}) {
    const {state: {trezorAddresses}} = useStateValue();

    const [trezorAddress, setTrezorAddress] = useState(null);
    const [trezorAddressIndex, setTrezorAddressIndex] = useState(null);
    const changeTrezorAddress = changeEvent => {
        const index = changeEvent.target.dataset.index;
        setTrezorAddress(changeEvent.target.value);
        setTrezorAddressIndex(index);
        setAddressIndex(index);
    };

    useEffect(_ => {
        if (trezorAddresses.addresses.length > 0 && !trezorAddress && trezorAddressIndex === null) {
            const address = trezorAddresses.addresses[0];
            setTrezorAddress(address.address);
            setTrezorAddressIndex(address.index);
            setAddressIndex(address.index);
        }
    }, [trezorAddresses, trezorAddress, trezorAddressIndex]);

    return <Modal id={id} show={isShow} onHide={onClose} animation={true}>
        <Modal.Header closeButton>
            <Modal.Title>Select Trezor address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {trezorAddresses.inProcessReceiving && <Spinner/>}

            <div className="form-check">
                {!trezorAddresses.inProcessReceiving && trezorAddresses.addresses.slice(0, 5).map((item, i) => {
                    return <div key={item.index}>
                        <input className="form-check-input" type="radio" name="addresses"
                               onChange={changeTrezorAddress}
                               value={item.address}
                               data-index={item.index}
                               checked={trezorAddress === item.address}/>
                        <label className="form-check-label">
                            {item.address}
                        </label>
                    </div>;
                })}
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
                Cancel
            </Button>
            <Button disabled={!trezorAddress} variant="primary" onClick={_ => {
                if (onComplete) {
                    onComplete(trezorAddress, trezorAddressIndex);
                }
                onClose();
            }}>
                {completeText}
            </Button>
        </Modal.Footer>
    </Modal>;
}

export default TrezorSelectWallet;
