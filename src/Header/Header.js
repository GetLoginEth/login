import React, {Fragment} from 'react';
import './Header.css';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link, matchPath} from "react-router-dom";
import {NavDropdown} from "react-bootstrap";

function Header({isLoggedIn, isCheckingAuth, username, balance, app}) {
    /*const result = matchPath(window.location.pathname, {
        path: "/:swarm_protocol?/:swarm_hash?/:page"
    });*/
    const result = matchPath(window.location.pathname, {
        path: "/:page"
    });

    const page = result && result.params ? result.params.page : '';

    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Link className="navbar-brand" to="./">GetLogin</Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isLoggedIn && <Fragment>
                            <Link
                                className={`nav-link ${page === 'xsettings' ? 'active' : ''}`}
                                to="./xsettings">Settings</Link>
                            <Link
                                className={`nav-link ${page === 'xinvite' ? 'active' : ''}`}
                                to="./xinvite">Invite</Link>
                        </Fragment>}
                    </Nav>

                    {!isCheckingAuth && <Nav className="ml-auto">
                        {!isLoggedIn && <>
                            <Link
                                className={`nav-link float-right ${page === 'login' ? 'active' : ''}`}
                                to="./login">Sign in</Link>
                            <Link
                                className={`nav-link ${page === 'xsignup' ? 'active' : ''}`}
                                to="./xsignup">Sign up</Link>
                        </>}

                        {isLoggedIn && <NavDropdown title="Profile" id="user-dropdown">
                            <NavDropdown.Item disabled>{username}</NavDropdown.Item>
                            <NavDropdown.Item disabled>{!balance.web ? '...' : balance.web} {app.currency}</NavDropdown.Item>
                            <NavDropdown.Item disabled>{!balance.bzzWeb ? '...' : balance.bzzWeb} {app.bzz.name}</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <Link to="./logout" className="dropdown-item">Logout</Link>
                        </NavDropdown>}
                    </Nav>}
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
