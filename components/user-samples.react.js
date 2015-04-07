var React = require('react');

var Panel = require('react-bootstrap/lib/Panel');
var SearchResult = require('./search-result.react.js');

var UserSamples = React.createClass({
    getInitialState: function() {
        return {
            selectedSample : null
        };
    },

    selectSample: function(id) {
        this.setState({ selectedSample: id });
        this.props.selectSample(id);
    },

    render: function() {
        var results = [];
        for (var id in this.props.userSamples) {
            var sound = this.props.userSamples[id];
            if (!sound.isFavourite) continue;
            results.push(( 
                <SearchResult audio={sound} key={id} active={this.state.selectedSample===sound.id} selectSample={this.selectSample} userTags={sound.userTags} />
            ));
        }
        return (
            <Panel header={( <h3>Favourite samples</h3> )}>
                <div id="search-results" className="panel-body" style={{ minHeight: '500px', maxHeight: '500px', padding: '0px', overflowY: 'scroll' }}>
                    { results }
                </div>
            </Panel>
        )
    }
});

module.exports = UserSamples;
