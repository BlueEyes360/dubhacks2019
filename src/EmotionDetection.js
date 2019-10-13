import React, { Component } from 'react';
import $ from 'jquery';

import { MICROSOFT_API_KEY1, MICROSOFT_BASE_URL } from './keys/MicrosoftKeys';

class EmotionDetection extends Component {

    state = {
        anger: '',
        contempt: '',
        disgust: '',
        fear: '',
        happiness: '',
        neutral: '',
        sadness: '',
        surprise: ''
    }

    componentDidUpdate() {
        this.processImage();
    }

    processImage() {
        var subscriptionKey = MICROSOFT_API_KEY1;
        var baseURL = MICROSOFT_BASE_URL;

        var params = {
            "returnFaceAttributes":
                "age,gender,emotion"
        };

        var sourceImageURL = "https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg";
        $.ajax({
            url: baseURL + "?" + $.param(params),

            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            data: '{"url": "' + sourceImageURL + '"}',
        })
        .done(function(data) {
            console.log(data[0].faceAttributes.emotion);
            this.setState = {
                anger: data[0].faceAttributes.emotion.anger,
                contempt: data[0].faceAttributes.emotion.contempt,
                disgust: data[0].faceAttributes.emotion.disgust,
                fear: data[0].faceAttributes.emotion.fear,
                happiness: data[0].faceAttributes.emotion.hapiness,
                neutral: data[0].faceAttributes.emotion.neutral,
                sadness: data[0].faceAttributes.emotion.sadness,
                surprise: data[0].faceAttributes.emotion.surpirse
            }
        })
    }

    render() {
        this.processImage();
        return (
            <div className="App">
                <h1>{this.state.happiness}</h1>
            </div>
        );
    }
}

export default EmotionDetection;
