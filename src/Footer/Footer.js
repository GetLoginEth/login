import React from 'react';
import './Footer.css';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
               © 2020 Company, Inc. · <Link to="/privacy">Privacy</Link> · <Link to="/terms">Terms</Link>
        </footer>
    );
}

export default Footer;
