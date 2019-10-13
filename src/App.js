import React, { Component } from 'react';
import Video from './components/Video/Video';
import Captions from './components/Captions/Captions';
import UI from './components/UI/UI';

import './App.css';

class App extends Component {

    render() {

        return (
            <div className="App">
                <Video></Video>
                <Captions></Captions>
                <UI></UI>
            </div>
        );
    }
}

export default App;
