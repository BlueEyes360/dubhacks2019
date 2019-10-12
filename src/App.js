import React, { Component } from 'react';
import './App.css';
import Video from './components/Video/Video';
import Microphone from './components/Microphone/Microphone';

class App extends Component {

    render() {
        
        return (
            <div className="App">
                <Video></Video>
                <Microphone></Microphone>
            </div>
        );
    }
}

export default App;
