import React from 'react';

function WaitButton({children, disabled}) {
    let text = children.props.children;
    if (disabled) {
        text =
            <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"/> {text}</span>;
    } else {
        if (children.props.disabled) {
            disabled = true;
        }
    }

    return React.cloneElement(children, {
        disabled,
        children: text
    });
}

export default WaitButton;
