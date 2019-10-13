import React, { Component } from 'react';
import $ from 'jquery';

import { MICROSOFT_API_KEY1, MICROSOFT_BASE_URL } from '../../keys/MicrosoftKeys';

class EmotionDetection extends Component {

    state = {
        count: 1,
    };

    componentDidMount = () => {
        this.processImage();
    }

    processImage = () => {
        var thisVar = this;
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
            var emotionObject = data[0].faceAttributes.emotion;
            console.log(emotionObject);
            
            var array = [
                data[0].faceAttributes.emotion.anger,
                data[0].faceAttributes.emotion.contempt,
                data[0].faceAttributes.emotion.disgust,
                data[0].faceAttributes.emotion.fear,
                data[0].faceAttributes.emotion.happiness,
                data[0].faceAttributes.emotion.neutral,
                data[0].faceAttributes.emotion.sadness,
                data[0].faceAttributes.emotion.surprise
            ];

            var max = array[0];
            var maxIndex = 0;

            for (var i = 1; i < array.length; i++)
            {
                if (array[i] > max)
                {
                    maxIndex = i;
                    max = array[i];
                }
            }

            thisVar.setState({ count: maxIndex });  
        })
    }

    render() {
        return (
            <div className="App">
                <span className = {this.emotionColorCalc()}>Face</span>
            </div>
        );
    }

    emotionColorCalc = () => {
        let emotions = "badge m-2 badge-";
        switch (this.state.count) {
            case 0:
                emotions += "dark";
                break;
            case 1:
                emotions += "primary";
                break;
            case 2:
                emotions += "secondary";
                break;
            case 3:
                emotions += "success";
                break;
            case 4:
                emotions += "danger";
                break;
            case 5:
                emotions += "warning";
                break;
            case 6:
                emotions += "info";
                break;
            default:
                emotions += "dark";
        }
        return emotions;
    }
}

export default EmotionDetection;
