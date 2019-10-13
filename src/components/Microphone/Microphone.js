import React, { Component } from 'react';
import $ from 'jquery';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Microphone.css";

class Microphone extends Component {

    componentDidMount() {
        const fs = require('fs');
        const recorder = require('node-record-lpcm16');
        const speech = require('@google-cloud/speech'); //Import the Goolge Cloud client
        
        const client = new speech.SpeechClient();
        const encoding = 'LINEAR16';
        const sampleRateHertz = 16000;
        const languageCode = 'BCP-47 en-US';
        
        var recognizeStream;
        
       const config = {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
        };
        const audio = {
            content: fs.readFileSync(recognizeStream).toString('base64'),
        };

        recorder
          .record({
            sampleRateHertz: sampleRateHertz,
            threshold: 0,
            verbose: false,
            recordProgram: 'rec', // Try also "arecord" or "sox"
            silence: '3.0',
          })
          .stream()
          .on('error', console.error)
          .pipe(recognizeStream);
          
          $.ajax({
              url: "https://speech.googleapis.com/v1/speech:recognize",
              
              beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Authentication", "AIzaSyCDa5topLkHmECOXzQli39zeABA8YkP2wg");
              },

              type: "POST",
              data:'{ "config": {"'+ config + '" }, "audio": {"' + audio + '"}'
          })
        console.log('Listening, press Ctrl+C to stop.');
    };

    render() {
        return (
            <>
            </>
        );
    }
}

export default Microphone;