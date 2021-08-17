import React from 'react';
import './Footer.css';
import {Link} from "react-router-dom";

function Footer({buildDate}) {
    return (
        <footer className="footer text-center text-sm-left">
            <span className="text-muted">© 2021 GetLogin.org · <Link to="./privacy">
                Privacy
            </Link> · <Link
                to="./terms">Terms</Link> · <Link to="./developers">
                Developers
            </Link> · <a href="https://github.com/GetLoginEth/login" target="_blank" rel="noopener noreferrer">
                GitHub
            </a>
            </span>
            <span className="Footer-build mx-sm-3 float-sm-right text-muted">Build date: {buildDate}</span>
        </footer>
    );
}

export default Footer;
