import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Link, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import './App.css';
import {StateProvider} from '../reducers/state';
import {initialState, reducer} from '../reducers/mainReducer';

const Main = lazy(() => import('../Main'));
const Dashboard = lazy(() => import('../Dashboard'));

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

                        <Suspense fallback={<div>Loading...</div>}>
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
                        </Suspense>
                </Router>
            </StateProvider>);
    }
}

export default App;
