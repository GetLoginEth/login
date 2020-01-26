import React, {useEffect} from 'react';
import './Plugin.css';
import PluginReceiver from "./PluginReceiver";
import {web3} from "../reducers/actions";

function Plugin() {
    useEffect(_ => {
        if (window.pluginReceiver) {
            return;
        }

        window.pluginReceiver = new PluginReceiver(web3);
        window.pluginReceiver.init();
    }, []);
    return <div className="Plugin">
        <h1 className="text-center">Plugin here</h1>
    </div>;
}

export default Plugin;
