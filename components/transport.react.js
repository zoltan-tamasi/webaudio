var React = require('react');

var Panel = require('react-bootstrap/lib/Panel');

var TransportPanel = React.createClass({
    playSound: function() {
        this.props.playSound();
    },

    pauseSound: function() {
        this.props.pauseSound();
    },

    rewind: function() {
        this.props.rewind();
    },

    fastForward: function() {
        this.props.fastForward();
    },

    render: function() {
        return (
			<Panel header={( <h3>Transport</h3> )}>
                <div className="panel-body" style={{ minHeight: '100px', maxHeight: '100px', textAlign: 'center' }}>
                    <img id="loading" src="icons/loading.gif" width="60px" style={{ display: 'none' }} />
                    <a id="rwd-button" href="#" onClick={ this.rewind }>
                        <img src="icons/rwd.png" width="40px" />
                    </a>
                    <a id="pause-button" href="#" onClick={ this.pauseSound }>
                        <img src="icons/pause.png" width="40px" />
                    </a>
                    <a id="play-button" href="#" onClick={ this.playSound }>
                        <img src="icons/play.png" width="40px" />
                    </a>
                    <a id="ffwd-button" href="#" onClick={ this.fastForward }>
                        <img src="icons/ffwd.png" width="40px" />
                    </a>
                </div>
            </Panel>
        )
    }
});

module.exports = TransportPanel;