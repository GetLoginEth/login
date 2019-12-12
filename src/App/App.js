import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import './App.css';
import {StateContext, StateProvider} from '../reducers/state';
import {initialState, reducer} from '../reducers/mainReducer';
import Header from "../Header";
import Footer from "../Footer";

const Main = lazy(() => import('../Main'));
const Dashboard = lazy(() => import('../Dashboard'));
const Signin = lazy(() => import('../Signin'));
const Signup = lazy(() => import('../Signup'));
const Logout = lazy(() => import('../Logout'));
const Privacy = lazy(() => import('../Page/Privacy'));
const Terms = lazy(() => import('../Page/Terms'));

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
                        <Redirect to={{pathname: "/login", state: {from: location}}}/>);
                }
            }}
        />
    );
}

const LoginRoute = ({state, path, children}) => {
    return state.user.isLoggedIn() ? <Redirect to={{pathname: "/"}}/> : <Route path={path}>
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
                                            <Route exact path="/">
                                                <Main/>
                                            </Route>

                                            <Route path="/settings">
                                                <div>Settings hehehehehe</div>
                                            </Route>

                                            <Route path="/privacy">
                                                <Privacy/>
                                            </Route>

                                            <Route path="/terms">
                                                <Terms/>
                                            </Route>

                                            <LoginRoute path="/login" state={state}>
                                                <Signin/>
                                            </LoginRoute>

                                            <LoginRoute path="/signup" state={state}>
                                                <Signup/>
                                            </LoginRoute>

                                            <PrivateRoute path="/dashboard" state={state}>
                                                <Dashboard/>
                                            </PrivateRoute>

                                            <PrivateRoute path="/logout" state={state}>
                                                <Logout/>
                                            </PrivateRoute>

                                            <Route path="*">
                                                <NoMatch/>
                                            </Route>
                                        </Switch>
                                    </Suspense>
                                </div>
                            </main>
                            <Footer/>
                        </Router>;
                    }}
                </StateContext.Consumer>
            </StateProvider>);
    }
}

export default App;
