import React from 'react';
import './Plugin.css';

const listener = (event) => {
    /*console.log(event.data);
    console.log(event.origin);*/
    if (typeof event.data === 'object' && (event.data.method === 'test' || event.data.method === 'test_two')) {
        console.log('LOGIN MODULE test. Send answer');
        event.source.postMessage({
            id: event.data.id,
            hola: 'ok',
            tx: '1231232'
        }, event.origin);
    }
};

function Plugin() {
    window.addEventListener("message", listener);
    window.parent.postMessage('get_login_init', '*');
    return <div className="Plugin">
        <h1 className="text-center">Plugin here</h1>
    </div>;
}

export default Plugin;
