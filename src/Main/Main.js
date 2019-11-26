import React, {Component} from 'react';
import './Main.css';
import {StateContext} from '../reducers/state';
import {changeTheme} from "../reducers/actions";

/*class Main extends Component {
    render() {
        //const [{theme}] = this.context;
        //console.log(this.context);
console.log(this.context);
        return <div>

            <p>Main public page</p>

            <button onClick={_ => {
                changeTheme('lololo');
            }}>
                Boom --
            </button>
        </div>;
    }
}

//Main.contextType = StateContext;

export default Main;*/

export default function Main() {
    return (
        <StateContext.Consumer>
            {(one,two) => (
               <div>theme here {JSON.stringify(one)} {JSON.stringify(two)}

                   <button onClick={_ => {
                       changeTheme('lololo');
                   }}>
                       Boom --
                   </button>
               </div>
            )}
        </StateContext.Consumer>
    );
}
