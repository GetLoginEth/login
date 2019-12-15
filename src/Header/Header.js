import React from 'react';
import './Header.css';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import {Link} from "react-router-dom";

function Header({isLoggedIn, isCheckingAuth, username}) {
    return (
        <header>
            <Navbar bg="light" expand="lg">
                <Link className="navbar-brand" to="./">GetLogin</Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {isLoggedIn && <Link className="nav-link" to="./xsettings">Settings</Link>}

                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>*/}
                    </Nav>

                    {!isCheckingAuth && <Nav className="ml-auto">
                        {!isLoggedIn && <Link className="nav-link float-right" to="./login">Sign in</Link>}
                        {isLoggedIn && <Link className="nav-link float-right" to="./logout">Logout ({username})</Link>}
                    </Nav>}
                    {/*<Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2"/>
                        <Button variant="outline-success">Search</Button>
                    </Form>*/}
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
}

export default Header;
