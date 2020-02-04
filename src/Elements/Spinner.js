import React from 'react';

function Spinner() {
    return <div className="App-loading text-center">
        <div className="spinner-border text-success" role="status">
            <span className="sr-only">Loading...</span>
        </div>
    </div>;
}

export default Spinner;
