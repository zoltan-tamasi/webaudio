var React = require('react');

var WaveformPanel = React.createClass({
    render: function() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">Waveform</h3>
                </div>
                <div className="panel-body" id="waveform-panel" style={{  padding: "0px" }}>
                    <div id="waveform" style={{ backgroundColor : "black" }} />
                </div>
                <div className="panel-body" id="image-panel" style={{  padding: "0px", textAlign: "center" }}>
                    <div id="image" />
                </div>
            </div>
        )
    }
});

module.exports = WaveformPanel;