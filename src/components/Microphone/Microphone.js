import React, { Component } from 'react';
import $ from 'jquery';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Microphone.css';
//import { func } from 'C:/Users/tsesu/AppData/Local/Microsoft/TypeScript/3.6/node_modules/@types/prop-types';

class Microphone extends Component {

    componentDidMount() {
        const SUB_KEY = "f1c1a1b5b421452cafb77556f5896f27";
        const BASE_URL = "https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken";
        var token = "";
        
        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUB_KEY);
                //xhrObj.setRequestHeader("Host","https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken");
                //xhrObj.setRequestHeader("Content-Length", 0);
            },
            url: BASE_URL, 
            type: "POST",
        })
        .done(function(data) {
            token = data[0];
        })

        const BASE_URL_TTS = "https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US";
        var response = "";
        var wav_url = "http://www.voiptroubleshooter.com/open_speech/american/OSR_us_000_0030_8k.wav";

        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","audio/wav; codecs=audio/pcm; samplerate=16000");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", SUB_KEY);
                xhrObj.setRequestHeader("Authorization", "Bearer " + token);
                xhrObj.setRequestHeader("Accept", "application/json");
            },
            url: BASE_URL_TTS, 
            type: "POST",
            format: "simple",
            body: wav_url,
        })
        .done(function(data) {
            response = data.DisplayText[0];
        })

        console.log('response ' + response);
    };

    render() {
        return (
            <>
            </>
        );
    }
}

export default Microphone;