import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

import $ from 'jquery';
import { MICROSOFT_API_KEY1, MICROSOFT_BASE_URL } from '../../keys/MicrosoftKeys';

import "./Video.css";

class Video extends Component {

    state = {
        pictureURI: '',
        emotion: 1
    }

    grabScreenshot = () => {
        var video = document.getElementById('video');
        var canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 1920, 1080);
        var img = new Image();
        img.src = canvas.toDataURL("image/png");
        var dataURI = canvas.toDataURL('image/jpeg');
        this.setState({pictureURI: dataURI});
        this.processImage(dataURI);
    }

    processImage = (imageURI) => {
        var thisVar = this;
        var subscriptionKey = MICROSOFT_API_KEY1;
        var baseURL = MICROSOFT_BASE_URL;
        var params = {
            "returnFaceAttributes":
                "age,gender,emotion"
        };
        var sourceImageURL = imageURI;
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
            thisVar.setState({ emotion: maxIndex });
        })
    }

    emotionColorCalc = () => {
        let emotions = "badge m-2 badge-";
        switch (this.state.emotion) {
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

    componentDidMount() {
        var video = document.getElementById('video');

        // Get access to the camera!
        if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Not adding `{ audio: true }` since we only want video now
            navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } }).then(function(stream) {
                //video.src = window.URL.createObjectURL(stream);
                video.srcObject = stream;
                video.play();
            });
        }
    };


    render() {
        let display = null;

        if(this.state.pictureURI !== ''){
            display = (
                <img src={this.state.pictureURI} className="screenshot" alt="text"></img>
            )
        }

        return (
            <Container fluid>
                <Row>
                    <video id="video" autoPlay>
                    </video>
                    <button onClick={() => this.grabScreenshot()} className="myButton">Click Me</button>
                    {display}
                    <span className = {this.emotionColorCalc()}>Face</span>
                </Row>
            </Container>
        );
    }
}

export default Video;