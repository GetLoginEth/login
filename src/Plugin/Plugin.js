import React, {useEffect} from 'react';
import './Plugin.css';
import PluginReceiver from "./PluginReceiver";

function Plugin() {
    useEffect(_ => {
        if (window.pluginReceiver) {
            return;
        }

        window.pluginReceiver = new PluginReceiver();
        window.pluginReceiver.init();
    }, []);
    return <div className="Plugin">
        <h1 className="text-center">Plugin here</h1>
    </div>;
}

export default Plugin;
