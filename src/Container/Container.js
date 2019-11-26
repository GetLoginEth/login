import {Component} from 'react';
import './Container.css';
import {StateContext} from '../reducers/state';
import {getDispatch, setDispatch} from '../reducers/actions';

class Container extends Component {
    render() {
        if (!getDispatch()) {
            console.log('set dispatch');
            setDispatch(this.context.dispatch);
        }

        return this.props.children;
    }
}

Container.contextType = StateContext;

export default Container;
