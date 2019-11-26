import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Link, Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import './App.css';
import {StateProvider, StateContext} from '../reducers/state';
import {initialState, reducer, USER_STATUS_LOGGED} from '../reducers/mainReducer';
import Header from "../Header";

const Main = lazy(() => import('../Main'));
const Dashboard = lazy(() => import('../Dashboard'));
const LoginForm = lazy(() => import('../LoginForm'));

const fakeAuth = {
    isAuthenticated: false
};

function PrivateRoute({children, state, ...rest}) {
    console.log(state);
    return (
        <Route
            {...rest}
            render={({location}) =>
                state.user.isLoggedIn() ? (children) : (
                    <Redirect to={{pathname: "/login", state: {from: location}}}/>)
            }
        />
    );
}

/*
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
*/

class App extends Component {
    render() {
        return (
            <StateProvider initialState={initialState} reducer={reducer}>
                <StateContext.Consumer>
                    {({state}) => {
                        //console.log(state);
                        return <Router>
                            <Header/>
                            <main role="main">
                                <div className="container">
                                    <Suspense fallback={<div>Loading...</div>}>
                                        <Switch>
                                            <Route path="/public">
                                                <Main/>
                                            </Route>
                                            <Route path="/settings">
                                                <div>Settings hehehehehe</div>
                                            </Route>
                                            <Route path="/login">
                                                <LoginForm/>
                                            </Route>
                                            <PrivateRoute path="/protected" state={state}>
                                                <Dashboard/>
                                            </PrivateRoute>
                                        </Switch>
                                    </Suspense>
                                </div>
                            </main>
                        </Router>;
                    }}
                </StateContext.Consumer>
            </StateProvider>);
    }
}

export default App;
