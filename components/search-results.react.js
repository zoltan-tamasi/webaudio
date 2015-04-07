var React = require('react');

var Panel = require('react-bootstrap/lib/Panel');
var SearchResult = require('./search-result.react.js');

var SearchResults = React.createClass({
    getInitialState: function() {
        return {
            selectedSample : null
        };
    },

    selectSample: function(id) {
        this.setState({ selectedSample: id });
        this.props.selectSample(id);
    },

    prevResultsPage: function() {
        this.props.resultsPage(false);
    },

    nextResultsPage: function() {
        this.props.resultsPage(true);
    },

    render: function() {
        var results = this.props.searchResults.results && this.props.searchResults.results.map(function(result) {
            var userTags = this.props.sounds && this.props.sounds[result.id] && this.props.sounds[result.id].userTags;
            return ( 
                <SearchResult audio={result} key={result.id} active={this.state.selectedSample===result.id} selectSample={this.selectSample} userTags={userTags}/>
            )
        }.bind(this));
        return (
            <Panel header={( <h3>Search results</h3> )}>
                <div id="search-results" className="panel-body" style={{ minHeight: '500px', maxHeight: '500px', padding: '0px', overflowY: 'scroll' }}>
                    { results }
                </div>
                <nav>
                    <ul className="pager">
                        <li className={ this.props.searchResults && this.props.searchResults.previous == null ? "hidden" : null }>
                            <a href="#" onClick={ this.prevResultsPage }>Previous</a>
                        </li>
                        <li className={ this.props.searchResults && this.props.searchResults.next == null ? "hidden" : null }>
                            <a href="#" onClick={ this.nextResultsPage }>Next</a>
                        </li>
                    </ul>
                </nav>
            </Panel>
        )
    }
});

module.exports = SearchResults;
