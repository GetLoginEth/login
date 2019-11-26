import {Component} from 'react';
import './Container.css';
import {StateContext} from '../reducers/state';
import {getDispatch, setDispatch} from '../reducers/actions';

class Container extends Component {
    render() {
        const [{}, dispatch] = this.context;

        if (!getDispatch()) {
            console.log('set dispatch');
            setDispatch(dispatch);
        }

        return this.props.children;
    }
}

Container.contextType = StateContext;

export default Container;
