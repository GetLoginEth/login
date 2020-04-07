import React, {Fragment} from 'react';
import './Header.css';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link, matchPath} from "react-router-dom";

function Header({isLoggedIn, isCheckingAuth, username, balance}) {
    const result = matchPath(window.location.pathname, {
        path: "/:swarm_protocol?/:swarm_hash?/:page"
    });

    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Link className="navbar-brand" to="./">GetLogin</Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isLoggedIn && <Fragment>
                            <Link className={`nav-link ${result.params.page === 'xsettings' ? 'active' : ''}`}
                                  to="./xsettings">Settings</Link>
                            <Link className={`nav-link ${result.params.page === 'xinvite' ? 'active' : ''}`}
                                  to="./xinvite">Invite</Link>
                        </Fragment>}
                    </Nav>

                    {!isCheckingAuth && <Nav className="ml-auto">
                        {!isLoggedIn && <>
                            <Link className={`nav-link float-right ${result.params.page === 'login' ? 'active' : ''}`}
                                  to="./login">Sign in</Link>
                            <Link className={`nav-link ${result.params.page === 'xsignup' ? 'active' : ''}`}
                                  to="./xsignup">Sign up</Link>
                        </>}
                        {isLoggedIn &&
                        <Link className={`nav-link float-right ${result.params.page === 'logout' ? 'active' : ''}`}
                              to="./logout">Logout ({username}) |
                            Balance: {!balance ? '...' : balance} ETH</Link>}
                    </Nav>}
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
