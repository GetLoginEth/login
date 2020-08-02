import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {act} from 'react-dom/test-utils';

it('renders without crashing', () => {
    act(() => {
        const div = document.createElement('div');

        ReactDOM.render(<App/>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
