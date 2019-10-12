import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./Video.css";

class Video extends Component {

    componentDidMount() {
        var video = document.getElementById('video');
        video.style.width = "100vw";
        video.style.height = "100vh";

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
        return (
            <Container fluid>
                <Row>
                    <video id="video" autoPlay></video>
                </Row>
            </Container>
        );
    }
}

export default Video;