import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Microphone.css";

class Microphone extends Component {

    componentDidMount() {
        const recorder = require('node-record-lpcm16');
        const speech = require('@google-cloud/speech'); //Import the Goolge Cloud client
        
        const client = new speech.SpeechClient();
        const encoding = 'LINEAR16';
        const sampleRateHertz = 16000;
        const languageCode = 'BCP-47 en-US';
        
        const request = {
          config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode,
          },
          interimResults: false, // If you want interim results, set this to true
        };
        
        // Create a recognize stream
        const recognizeStream = client
          .streamingRecognize(request)
          .on('error', console.error)
          .on('data', data =>
            process.stdout.write(
              data.results[0] && data.results[0].alternatives[0]
                ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                : `\n\nReached transcription time limit, press Ctrl+C\n`
            )
          );
        
        // Start recording and send the microphone input to the Speech API
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