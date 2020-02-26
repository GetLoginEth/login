import React, {Component} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';
import {Link} from "react-router-dom";
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import WebIcon from '@material-ui/icons/Web';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import DynamicFeedIcon from '@material-ui/icons/DynamicFeed';

class Main extends Component {
    render() {
        const {state} = this.context;

        return <div className="text-center">
            {/*<h1>Web3 Auth plugin</h1>*/}
            <div className="row">
                <div className="col-lg-5 Main-call">
                    <p className="Main-call-title">Let people use your dApp everywhere</p>
                    <p className="Main-call-description">At GetLogin, we build trusted ecosystem that let your
                        customers use Ethereum blockchain in the usual web2-way.</p>
                    {state.user.isLoggedIn() ? <Link className="btn btn-success btn-lg" to="./xsettings">Open Settings</Link> :
                        <Link className="btn btn-success btn-lg" to="./xsignup">Get Started <KeyboardArrowRightIcon/></Link>}
                </div>
                <div className="col-lg-7 Main-call-advantages">
                    <p><WebIcon fontSize={'large'}/> All modern browsers (Chrome, Safari and etc.)</p>
                    <p><PhoneIphoneIcon fontSize={'large'}/> All OS: Windows, OS X, Linux, Android, iOS</p>
                    <p><DynamicFeedIcon fontSize={'large'}/> One username for all apps</p>
                    <p><NotInterestedIcon fontSize={'large'}/> No plugins, no downloads</p>
                </div>
            </div>
        </div>;
    }
}

Main.contextType = StateContext;

export default Main;
