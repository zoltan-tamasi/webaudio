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
var UserSamples = require('./user-samples.react');

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
            },
            mainState: "searchState",
            playState: "preview",
            userData: { sounds: [] }
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
                            this.setState({ loggedIn : true, userData : responseObj.user });
                        }.bind(this),
                        contentType: 'application/json; charset=utf-8'
                    });
                } else {
                    BootstrapDialog.show({  message: responseObj.message });
                }
            }.bind(this)
        });
    },

    regUser: function(email, password, username) {
        var user = {
            email : email,
            password : password,
            username : username
        };
        $.ajax({
            url: "/api/user",
            type: "POST",
            data: JSON.stringify(user),
            success: function(response) {
                var responseObj = JSON.parse(response);
                if (responseObj.success) {
                    BootstrapDialog.show({  message: responseObj.message });
                } else {
                    BootstrapDialog.show({  message: responseObj.message });
                }
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    logout: function() {
        $.ajax({
            url: "/api/session",
            success: function() {
                this.setState({  loggedIn : false });
            }.bind(this),
            type: "DELETE"
        });
    },

    selectSample: function(id) {
        $("#waveform-panel").hide();
        $("#image-panel").show();
        $("#image-panel").empty();
        $.get("/sounddata/" + id, function(audio) {
            var audio = JSON.parse(audio);
            $("#image-panel").html($("<img id='image'>").attr("src", audio.images.waveform_l));
            var userNotes = this.state.userData.sounds && this.state.userData.sounds[id] && this.state.userData.sounds[id].userNotes; 
            var isFavourite = this.state.userData.sounds && this.state.userData.sounds[id] && this.state.userData.sounds[id].isFavourite;
            $.extend(audio, { userNotes : userNotes, isFavourite : isFavourite });
            this.setState({ selectedSample : audio, playState : "preview" });
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
        if (this.state.playState == "loaded") {
            wavesurfer.play();
        } else {
            $("#image-panel").hide();
            $("#waveform-panel").show();
            wavesurfer.load('downloadsound/' + this.state.selectedSample.id);
            wavesurfer.on('ready', function () {
                this.setState({  playState : "loaded" });
                wavesurfer.play();
            }.bind(this));
        }
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

    saveNotes: function(notes) {
        if (this.state.userData.sounds === undefined) {
            this.state.userData.sounds = {};
        }
        if (this.state.userData.sounds[this.state.selectedSample.id] === undefined) {
            this.state.userData.sounds[this.state.selectedSample.id] = {};
        } 
        this.state.userData.sounds[this.state.selectedSample.id].userNotes = notes;

        $.ajax({
            url: "/api/userdata",
            type: "POST",
            data: JSON.stringify(this.state.userData),
            success: function(response) {
                console.log(response);
            },
            contentType: 'application/json; charset=utf-8'
        });
    },

    addTag: function(tagName) {
        if (this.state.userData.sounds === undefined) {
            this.state.userData.sounds = {};
        }
        if (this.state.userData.sounds[this.state.selectedSample.id] === undefined) {
            this.state.userData.sounds[this.state.selectedSample.id] = {};
        } 
        if (this.state.userData.sounds[this.state.selectedSample.id].userTags === undefined) {
            this.state.userData.sounds[this.state.selectedSample.id].userTags = [];
        }
        this.state.userData.sounds[this.state.selectedSample.id].userTags.push(tagName);

        $.ajax({
            url: "/api/userdata",
            type: "POST",
            data: JSON.stringify(this.state.userData),
            success: function(response) {
                console.log(response);
                this.setState();
            }.bind(this),
            contentType: 'application/json; charset=utf-8'
        });
    },

    toggleFavourite: function() {
        if (this.state.userData.sounds === undefined) {
            this.state.userData.sounds = {};
        }
        if (this.state.userData.sounds[this.state.selectedSample.id] === undefined) {
            this.state.userData.sounds[this.state.selectedSample.id] = {};
        } 
        if (this.state.userData.sounds[this.state.selectedSample.id].isFavourite) {
            this.state.userData.sounds[this.state.selectedSample.id].isFavourite = false;
        } else {
            this.state.userData.sounds[this.state.selectedSample.id].isFavourite = true;
            this.state.userData.sounds[this.state.selectedSample.id].name = this.state.selectedSample.name;
            this.state.userData.sounds[this.state.selectedSample.id].tags = this.state.selectedSample.tags;
            this.state.userData.sounds[this.state.selectedSample.id].id = this.state.selectedSample.id;
        }

        $.ajax({
            url: "/api/userdata",
            type: "POST",
            data: JSON.stringify(this.state.userData),
            success: function(response) {
                console.log(response);
                this.setState();
            }.bind(this),
            contentType: 'application/json; charset=utf-8'
        });  
    },

    setMainState: function(state) {
        this.setState({ mainState : state });
    },

    render: function() {
        var selectedIsFavourite;
        if (this.state.userData.sounds === undefined) {
            selectedIsFavourite = false;
        } else if (!this.state.selectedSample) {
            selectedIsFavourite = false;
        } else if (this.state.userData.sounds[this.state.selectedSample.id] === undefined) {
            selectedIsFavourite = false;
        } else {
            selectedIsFavourite = !!this.state.userData.sounds[this.state.selectedSample.id].isFavourite;
        }

        return (
            <div className="container">
                { this.state.loggedIn ? null : (<Login login={this.login} regUser={this.regUser} />) }
                <Row className={this.state.loggedIn ? '' : 'hidden'}>
                    <Col md={4} sm={4} xs={12}>
                        <Navigation state={this.state.mainState} setMainState={this.setMainState} logout={this.logout}/>
                        <SelectedSamplesPanel selectedSample={ this.state.selectedSample } selectedIsFavourite={selectedIsFavourite}
                            saveNotes={this.saveNotes} addTag={this.addTag} toggleFavourite={this.toggleFavourite}/>
                        <TransportPanel playSound={this.playSound} pauseSound={this.pauseSound} rewind={this.rewind} fastForward={this.fastForward} />
                    </Col>
                
                        
                    { this.state.mainState == "searchState" ? (
                        <Col md={8} sm={8} xs={12}>
                            <SearchBar search={ this.search } />
                            <SearchResults sounds={this.state.userData.sounds} searchResults={ this.state.searchResults } 
                                selectSample={ this.selectSample } resultsPage={ this.resultsPage } />
                        </Col>
                    ) : (
                        <Col md={8} sm={8} xs={12}>
                            <UserSamples userSamples={this.state.userData.sounds} selectSample={ this.selectSample } />
                        </Col>
                    )}
                </Row>
                <Row className={this.state.loggedIn ? '' : 'hidden'}>
                    <WaveformPanel waveform={ this.state.waveform } wavesurfer={ wavesurfer }/>
                </Row>
            </div>
        );
    }
});

module.exports = App