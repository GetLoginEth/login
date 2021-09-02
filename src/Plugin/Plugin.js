import React, {useEffect} from 'react';
import './Plugin.css';
import PluginReceiver from "./PluginReceiver";
import {web3} from "../reducers/actions";
import {useStateValue} from "../reducers/state";

const {state: {user: {balance}}} = useStateValue();
const {state: {app}} = useStateValue();

function Plugin() {
    useEffect(_ => {
        if (window.pluginReceiver) {
            return;
        }

        window.pluginReceiver = new PluginReceiver(web3);
        window.pluginReceiver.init().then();
    }, []);

    useEffect(() => {
        window.pluginReceiver?.setData(balance, app);
    }, [balance, app]);

    return <div className="Plugin">
        <h1 className="text-center">Plugin page. Just for developers.</h1>
    </div>;
}

export default Plugin;
