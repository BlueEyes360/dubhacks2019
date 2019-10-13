import React, { Component } from 'react';

import "./Captions.css";

import $ from 'jquery';

import { MT_K } from '../../keys/MicrosoftKeys';

class Captions extends Component {
    state = {
        untranslated: "Voy a escribir una oración muy larga aquí y espero que todo funcione tan bien como puedo imaginar. Esto realmente tomó mucho tiempo y pasamos por todo tipo de problemas para que esto funcione. React no puede acceder al sistema de archivos y eso hizo las cosas muy difíciles. Pero aquí estamos y lo tenemos. Mas o menos. Un poco.",
        translated: ""
    }

    componentDidMount() {
        const KEY = MT_K;
        const MT_URL = "https://api.cognitive.microsofttranslator.com/translate";
        var t_string = this.state.untranslated;

        var params = {
            "api-version": "3.0",
            "to": "en"
        };
        var thisvar = this;

        $.ajax({
            beforeSend: function(xhrObj){
                xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", KEY);
            },
            url: MT_URL + "?" + $.param(params), 
            type: "POST",
            data: '[{"text": "' + t_string + '"}]',
        })
        .done(function(data) {
            thisvar.state.translated = data[0].translations[0].text;
        })
    }



    regularCaptions = "";
    translatedCaptions = "";

    getNextCaptions = () => {
        // console.log("    Getting next captions");
        if(this.state.translated !== "" || this.state.untranslated !== ""){
            let regularCapArray = this.state.untranslated.split(" ");
            let translatedCapArray = this.state.translated.split(" ");
            this.regularCaptions = "";
            this.translatedCaptions = "";
            for(let i = 0;i < 5;i++)
            {
                if(regularCapArray[0] !== undefined || translatedCapArray[0] !== undefined){
                    this.regularCaptions += regularCapArray[0] + " ";
                    regularCapArray.splice(0,1);
                    this.translatedCaptions += translatedCapArray[0] + " ";
                    translatedCapArray.splice(0,1);
                }
            }
            this.setState({untranslated: regularCapArray.join(" "), translated: translatedCapArray.join(" ")});
        }
    }

    startTimer = () => {
        setTimeout(this.getNextCaptions, 4000);
        // console.log("Timer started");
    }

    render() {

        this.startTimer();

        return (
            <>
                <div className="captions regCaptions">
                    {this.regularCaptions}
                </div>
                <div className="captions transCaptions">
                    {this.translatedCaptions}
                </div>
            </>
            );
    }
}

export default Captions;