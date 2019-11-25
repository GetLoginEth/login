import React, {Component} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useHistory,
    useLocation
} from "react-router-dom";
import './App.css';
import Main from "../Main";
import Dashboard from "../Dashboard";
import {StateProvider} from '../reducers/state';
import {reducer, initialState} from '../reducers/mainReducer';

const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        fakeAuth.isAuthenticated = true;
        setTimeout(cb, 100); // fake async
    },
    signout(cb) {
        fakeAuth.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};

function AuthButton() {
    let history = useHistory();

    return fakeAuth.isAuthenticated ? (
        <p>
            Welcome!{" "}
            <button
                onClick={() => {
                    fakeAuth.signout(() => history.push("/"));
                }}
            >
                Sign out
            </button>
        </p>
    ) : (
        <p>You are not logged in.</p>
    );
}

function PrivateRoute({children, ...rest}) {
    return (
        <Route
            {...rest}
            render={({location}) =>
                fakeAuth.isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: {from: location}
                        }}
                    />
                )
            }
        />
    );
}

function LoginPage() {
    let history = useHistory();
    let location = useLocation();

    let {from} = location.state || {from: {pathname: "/"}};
    let login = () => {
        fakeAuth.authenticate(() => {
            history.replace(from);
        });
    };

    return (
        <div>
            <p>You must log in to view the page at {from.pathname}</p>
            <button onClick={login}>Log in</button>
        </div>
    );
}

class App extends Component {

    render() {

        return (
            <StateProvider initialState={initialState} reducer={reducer}>
                <Router>
                    <div>
                        <AuthButton/>

                        <ul>
                            <li>
                                <Link to="/public">Public Page</Link>
                            </li>
                            <li>
                                <Link to="/protected">Protected Page</Link>
                            </li>
                            <li>
                                <Link to="/settings">Settings</Link>
                            </li>
                        </ul>

                        <Switch>
                            <Route path="/public">
                                <Main/>
                            </Route>
                            <Route path="/settings">
                                <div>Settings hehehehehe</div>
                            </Route>
                            <Route path="/login">
                                <LoginPage/>
                            </Route>
                            <PrivateRoute path="/protected">
                                <Dashboard/>
                            </PrivateRoute>
                        </Switch>
                    </div>
                </Router>
            </StateProvider>);
    }
}

export default App;
