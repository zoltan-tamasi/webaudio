var React = require('react');
var App = require('../components/app.react');

$(function() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

    React.render(
        <App />,
        $('body')[0]
    );
});

