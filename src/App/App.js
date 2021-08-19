import React, {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import 'typeface-poppins';
import {StateContext, StateProvider} from '../reducers/state';
import {initialState, reducer} from '../reducers/mainReducer';
import Header from "../Header";
import Footer from "../Footer";
import Spinner from "../Elements/Spinner";
import preval from 'preval.macro';

const Main = lazy(() => import('../Main'));
const Dashboard = lazy(() => import('../Dashboard'));
const Signin = lazy(() => import('../Signin'));
const Signup = lazy(() => import('../Signup'));
const Logout = lazy(() => import('../Logout'));
const Privacy = lazy(() => import('../Page/Privacy'));
const Terms = lazy(() => import('../Page/Terms'));
const Settings = lazy(() => import('../Settings'));
const Authorize = lazy(() => import('../Authorize'));
const Developers = lazy(() => import('../Developers'));
const DevelopersAppInfo = lazy(() => import('../DevelopersAppInfo'));
const DevelopersAppCreate = lazy(() => import('../DevelopersAppCreate'));
const DevelopersAppEdit = lazy(() => import('../DevelopersAppEdit'));
const Plugin = lazy(() => import('../Plugin'));
const Invite = lazy(() => import('../Invite'));
// todo move it to .env
const allowedDomains = [
    "getlogin.org",
    "getlogin.swarm-gateways.net",
    "getlogin.localhost:3000"
];

function PrivateRoute({children, state, computedMatch, ...rest}) {
    //console.log(rest);
    return (
        <Route
            {...rest}
            render={({location}) => {
                if (state.user.isCheckingAuth()) {
                    return <Spinner/>;
                } else {
                    const newChildren = React.cloneElement(children, {
                        computedMatch,
                        location
                    });
                    if (state.user.isLoggedIn()) {
                        return newChildren;
                    } else {
                        if (window.location.href.indexOf('/logout') < 0) {
                            window.sessionStorage.setItem('redirect_url', window.location.href);
                        }

                        return <Redirect to={{pathname: "./login", state: {from: location}}}/>;
                    }
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

function NotAllowedDomain() {
    return (
        <div>
            <h3>
                Domain isn't allowed
            </h3>
            <p>Please use one of the listed domains:</p>
            {allowedDomains.map((item, i) => <p key={i}><a href={`https://${item}`}>{item}</a></p>)}
        </div>
    );
}

function App() {
    const isCorrectDomain = allowedDomains.includes(window.location.host);
    //const pathPrefix="/:swarm_protocol?/:swarm_hash?";
    const pathPrefix = "";
    return (
        <StateProvider initialState={initialState} reducer={reducer}>
            <StateContext.Consumer>
                {({state}) => {
                    //console.log(state);
                    return <Router>

                        {isCorrectDomain && <Header isLoggedIn={state.user.isLoggedIn()}
                                                    isCheckingAuth={state.user.isCheckingAuth()}
                                                    username={state.user.username}
                                                    balance={state.user.balance}
                                                    app={state.app}
                        />}
                        <main role="main">
                            <div className="container">
                                <Suspense fallback={<Spinner/>}>
                                    <Switch>
                                        {!isCorrectDomain && <Route path="*">
                                            <NotAllowedDomain/>
                                        </Route>}

                                        <Route exact path={`${pathPrefix}/`}>
                                            <Main/>
                                        </Route>

                                        <Route path={`${pathPrefix}/privacy`}>
                                            <Privacy/>
                                        </Route>

                                        <Route path={`${pathPrefix}/terms`}>
                                            <Terms/>
                                        </Route>

                                        <Route path={`${pathPrefix}/xplugin`}>
                                            <Plugin/>
                                        </Route>

                                        <LoginRoute path={`${pathPrefix}/login`} state={state}>
                                            <Signin/>
                                        </LoginRoute>

                                        <LoginRoute path={`${pathPrefix}/xsignup`} state={state}>
                                            <Signup/>
                                        </LoginRoute>

                                        <PrivateRoute path={`${pathPrefix}/xsettings`} state={state}>
                                            <Settings/>
                                        </PrivateRoute>

                                        <PrivateRoute path={`${pathPrefix}/xinvite`} state={state}>
                                            <Invite/>
                                        </PrivateRoute>

                                        <PrivateRoute path={`${pathPrefix}/dashboard`} state={state}>
                                            <Dashboard/>
                                        </PrivateRoute>

                                        <PrivateRoute path={`${pathPrefix}/logout`} state={state}>
                                            <Logout/>
                                        </PrivateRoute>

                                        <PrivateRoute path={`${pathPrefix}/xauthorize`} state={state}>
                                            <Authorize/>
                                        </PrivateRoute>

                                        <PrivateRoute exact path={`${pathPrefix}/developers`}
                                                      state={state}>
                                            <Developers/>
                                        </PrivateRoute>

                                        <PrivateRoute exact path={`${pathPrefix}/developers-create`}
                                                      state={state}>
                                            <DevelopersAppCreate/>
                                        </PrivateRoute>

                                        <PrivateRoute exact path={`${pathPrefix}/developers-edit-:id`}
                                                      state={state}>
                                            <DevelopersAppEdit/>
                                        </PrivateRoute>

                                        <PrivateRoute path={`${pathPrefix}/developers-:id`}
                                                      state={state}>
                                            <DevelopersAppInfo/>
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

export default App;
