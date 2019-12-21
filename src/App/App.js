import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import {StateContext, StateProvider} from '../reducers/state';
import {initialState, reducer} from '../reducers/mainReducer';
import Header from "../Header";
import Footer from "../Footer";
import preval from 'preval.macro';

const Main = lazy(() => import('../Main'));
const Dashboard = lazy(() => import('../Dashboard'));
const Signin = lazy(() => import('../Signin'));
const Signup = lazy(() => import('../Signup'));
const Logout = lazy(() => import('../Logout'));
const Privacy = lazy(() => import('../Page/Privacy'));
const Terms = lazy(() => import('../Page/Terms'));
const Settings = lazy(() => import('../Settings'));

const Spinner = () => <div className="App-loading text-center">
    <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
    </div>
</div>;


function PrivateRoute({children, state, ...rest}) {
    //console.log(state);
    return (
        <Route
            {...rest}
            render={({location}) => {
                if (state.user.isCheckingAuth()) {
                    return <Spinner/>;
                } else {
                    return state.user.isLoggedIn() ? (children) : (
                        <Redirect to={{pathname: "./login", state: {from: location}}}/>);
                }
            }}
        />
    );
}

const LoginRoute = ({state, path, children}) => {
    return state.user.isLoggedIn() ? <Redirect to={{pathname: "./"}}/> : <Route path={path}>
        {children}
    </Route>;
};

function NoMatch() {
    return (
        <div>
            <h3>
                Page not found
            </h3>
        </div>
    );
}

class App extends Component {
    render() {
        return (
            <StateProvider initialState={initialState} reducer={reducer}>
                <StateContext.Consumer>
                    {({state}) => {
                        //console.log(state);
                        return <Router>
                            <Header isLoggedIn={state.user.isLoggedIn()} isCheckingAuth={state.user.isCheckingAuth()}
                                    username={state.user.username}/>
                            <main role="main">
                                <div className="container">
                                    <Suspense fallback={<Spinner/>}>
                                        <Switch>
                                            <Route exact path="/:swarm_protocol?/:swarm_hash?/">
                                                <Main/>
                                            </Route>

                                            <Route path="/:swarm_protocol?/:swarm_hash?/privacy">
                                                <Privacy/>
                                            </Route>

                                            <Route path="/:swarm_protocol?/:swarm_hash?/terms">
                                                <Terms/>
                                            </Route>

                                            <LoginRoute path="/:swarm_protocol?/:swarm_hash?/login" state={state}>
                                                <Signin/>
                                            </LoginRoute>

                                            <LoginRoute path="/:swarm_protocol?/:swarm_hash?/xsignup" state={state}>
                                                <Signup/>
                                            </LoginRoute>

                                            <PrivateRoute path="/:swarm_protocol?/:swarm_hash?/xsettings" state={state}>
                                                <Settings/>
                                            </PrivateRoute>

                                            <PrivateRoute path="/:swarm_protocol?/:swarm_hash?/dashboard" state={state}>
                                                <Dashboard/>
                                            </PrivateRoute>

                                            <PrivateRoute path="/:swarm_protocol?/:swarm_hash?/logout" state={state}>
                                                <Logout/>
                                            </PrivateRoute>

                                            <Route path="*">
                                                <NoMatch/>
                                            </Route>
                                        </Switch>
                                    </Suspense>
                                </div>
                            </main>
                            <Footer buildDate={preval`module.exports = new Date().toLocaleString();`}/>
                        </Router>;
                    }}
                </StateContext.Consumer>
            </StateProvider>);
    }
}

export default App;
