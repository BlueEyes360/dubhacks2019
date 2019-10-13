import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

import happyEmoji from '../../assets/happy.png';
import angerEmoji from '../../assets/anger.png';
import contemptEmoji from '../../assets/contempt.png';
import fearEmoji from '../../assets/fear.png';
import disgustEmoji from '../../assets/disgust.png';
import sadEmoji from '../../assets/sad.png';
import surpriseEmoji from '../../assets/surprise.png';
import poster from '../../assets/poster.png';

import $ from 'jquery';
import { MICROSOFT_API_KEY1, MICROSOFT_BASE_URL } from '../../keys/MicrosoftKeys';

import "./Video.css";

class Video extends Component {

    state = {
        pictureURI: '',
        newPicture: false,
        emotion: 1
    }

    makeblob = function (dataURL) {
        var BASE64_MARKER = ';base64,';
        var parts;
        var contentType;
        var raw;
        if (dataURL.indexOf(BASE64_MARKER) === -1) {
            parts = dataURL.split(',');
            contentType = parts[0].split(':')[1];
            raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        parts = dataURL.split(BASE64_MARKER);
        contentType = parts[0].split(':')[1];
        raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
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
                // data[0].faceAttributes.emotion.neutral,
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
            thisVar.setState({ emotion: maxIndex, newPicture: false });
        })
    }

    uploadToFirebase = (dataURI) => {
        // Firebase App (the core Firebase SDK) is always required and
        // must be listed before other Firebase SDKs
        var firebase = require("firebase/app");

        // Add the Firebase products that you want to use
        require("firebase/storage");

        var firebaseConfig = {
            apiKey: "AIzaSyC6ZRV50xoEiTALN8JWvoRsKVAR70ooVso",
            authDomain: "ar-dubs.firebaseapp.com",
            databaseURL: "https://ar-dubs.firebaseio.com",
            projectId: "ar-dubs",
            storageBucket: "ar-dubs.appspot.com",
            messagingSenderId: "679409577820",
            appId: "1:679409577820:web:f8167f0196320a3cf11b99",
            measurementId: "G-CQTTX866G0"
        };

        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }


        // Get a reference to the storage service, which is used to create references in your storage bucket
        var storage = firebase.storage();

        // Create a storage reference from our storage service
        var storageRef = storage.ref();

        var file = dataURI; // use the Blob or File API
        var context = this;
        // Create the file metadata
        var metadata = {
            contentType: 'image/jpeg'
        };
        // Upload file and metadata to the object 'images/mountains.jpg'
        var uploadTask = storageRef.child('images/' + file.name).put(file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            default:
                break;
            }
        }, function(error) {

        switch (error.code) {
            case 'storage/unauthorized':
            // User doesn't have permission to access the object
                break;
            case 'storage/canceled':
            // User canceled the upload
                break;
            case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
                break;
            default:
                break;
        }
        }, function() {
        // Upload completed successfully, now we can get the download URL
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                context.setState({pictureURI: downloadURL, newPicture: true});
            });
        });
    }

    grabScreenshot = () => {
        var video = document.getElementById('video');
        var canvas = document.createElement('canvas');
        canvas.width = 1920;
        canvas.height = 1080;

        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, 1920, 1080);
        var dataURI = canvas.toDataURL('image/jpeg');

        this.setState({pictureURI: dataURI});

        var dataURL = canvas.toDataURL('image/jpeg', 0.5);
        var blob = this.makeblob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append("canvasImage", blob);

        this.uploadToFirebase(blob);
    }

    emotionColorCalc = () => {
        switch (this.state.emotion) {
            case 0:
                return angerEmoji;
            case 1:
                return contemptEmoji;
            case 2:
                return disgustEmoji;
            case 3:
                return fearEmoji;
            case 4:
                return happyEmoji;
            case 5:
                return sadEmoji;
            case 6:
                return surpriseEmoji;
            default:
                return happyEmoji;
        }
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

        if(this.state.newPicture === true){
            this.processImage(this.state.pictureURI);
        }

        return (
            <Container fluid>
                <Row>
                    <video id="video" autoPlay poster={poster}/>
                    <button onClick={() => this.grabScreenshot()} className="myButton btn-primary">How are you feeling?</button>
                    <img src = {this.emotionColorCalc()} alt="Emoji"></img>
                </Row>
            </Container>
        );
    }
}

export default Video;