var React = require('react');

var ReactBootstrap = require('react-bootstrap');
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Navbar = ReactBootstrap.Navbar;
var Panel = ReactBootstrap.Panel;

var Login = require('./login.react');
var Navigation = require('./navigation.react');
var SelectedSamplesPanel = require('./selected-samples-panel.react');
var TransportPanel = require('./transport.react');
var SearchBar = require('./search-bar.react');
var SearchResults = require('./search-results.react');
var WaveformPanel = require('./waveform-panel.react');

var source, context;
var canvasWidth = 900;
var canvasHeight = 200;

var wavesurfer = Object.create(WaveSurfer);

function createCanvas(w, h) {
    var newCanvas = document.createElement('canvas');
    newCanvas.width  = w;
    newCanvas.height = h;
    return newCanvas;
};

var App = React.createClass({

    componentDidMount: function() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            context = new AudioContext();
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }

        var newCanvas = createCanvas(canvasWidth, canvasHeight);
        canvas = newCanvas.getContext('2d');

        wavesurfer.init({
            container: document.querySelector('#waveform'),
            waveColor: '#272',
            progressColor: '#8a8',
            fillParent: true,
            minPxPerSec: 10
        });
    },

    getInitialState: function() {
        return {
            loggedIn: false,
            searchResults: [],
            selectedSample: null,
            searchText: "",
            resultsPage: 1,
            waveform: {
                type: "image",
                waveform: null
            }
        };
    },

    login: function(email, password) {
        var credentials = {
            email: email,
            password: password
        };
        $.ajax({
            url: "/api/session",
            type: "GET",
            data: credentials,
            success: function(response) {
                var responseObj = JSON.parse(response);
                if (responseObj.success) {
                    $.ajax({
                        url: "/api/user",
                        data: JSON.stringify(credentials),
                        success: function(response) {
                            responseObj = JSON.parse(response);
                            this.setState({ loggedIn : true });
                        }.bind(this),
                        contentType: 'application/json; charset=utf-8'
                    });
                } else {
                    this.setState({ loginMessage: responseObj.message});
                }
            }.bind(this)
        });
    },

    regUser: function(email, password) {
        var user = {
            email : email,
            password : password
        };
        $.ajax({
            url: "/api/user",
            type: "POST",
            data: JSON.stringify(user),
            success: function(response) {
                var responseObj = JSON.parse(response);
                if (responseObj.success) {
                    initLoginRegView(false);
                } else {
                    context.message(responseObj.message);
                }
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    selectSample: function(id) {
        $("#waveform-panel").hide();
        $("#image-panel").show();
        $("#image-panel").empty();
        $.get("/sounddata/" + id, function(audio) {
            var audio = JSON.parse(audio);
            $("#image-panel").html($("<img id='image'>").attr("src", audio.images.waveform_l));
            this.setState({ selectedSample : audio });
        }.bind(this));
    },

    search: function(text, page) {
        var page = page ? parseInt(page, 10) : 1;
        this.setState({ searchText: text });
        $.get("/textsearch/" + text + "/" + page, function(response) {
            var response = JSON.parse(response);
            this.setState({ searchResults: response });
        }.bind(this));
    },

    playSound: function() {
        $("#image-panel").hide();
        $("#waveform-panel").show();
        wavesurfer.load('downloadsound/' + this.state.selectedSample.id);
        wavesurfer.on('ready', function () {
            wavesurfer.play();
        });
    },

    pauseSound: function() {
        wavesurfer.pause();
    },

    rewind: function() {
        wavesurfer.skipBackward();
    },

    fastForward: function() {
        wavesurfer.skipForward();
    },

    resultsPage: function(next) {
        var newPage = next ? this.state.resultsPage + 1 : this.state.resultsPage - 1;
        this.search(this.state.searchText, newPage);g
        this.setState({ resultsPage : newPage });
    },

    render: function() {
        return (
            <div className="container">
                { this.state.loggedIn ? null : (<Login login={this.login} regUser={this.regUser} />) }
                <Row className={this.state.loggedIn ? '' : 'hidden'}>
                    <Col md={4} sm={4} xs={12}>
                        <Navigation />
                        <SelectedSamplesPanel selectedSample={ this.state.selectedSample }/>
                        <TransportPanel playSound={this.playSound} pauseSound={this.pauseSound} rewind={this.rewind} fastForward={this.fastForward} />
                    </Col>
                    <Col md={8} sm={8} xs={12}>
                        <SearchBar search={ this.search }/>
                        <SearchResults searchResults={ this.state.searchResults } selectSample={ this.selectSample } resultsPage={ this.resultsPage } />
                    </Col>
                </Row>
                <Row className={this.state.loggedIn ? '' : 'hidden'}>
                    <WaveformPanel waveform={ this.state.waveform } wavesurfer={ wavesurfer }/>
                </Row>
            </div>
        );
    }
});

module.exports = App