import React from 'react';
import ReactDOM from 'react-dom';
import Signin from './Signin';
import {act} from 'react-dom/test-utils';

it('renders without crashing', () => {
    act(() => {
        const div = document.createElement('div');

        ReactDOM.render(<Signin/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
