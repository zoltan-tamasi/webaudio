var React = require('react');

var Navbar = require('react-bootstrap/lib/Navbar');

var SearchBar = React.createClass({

    invokeSearch: function() {
        this.props.search(React.findDOMNode(this.refs.searchInput).value);
    },

    render: function() {
        return (
			<Navbar role="navigation">
                <div className="navbar-header">
                    <div className="input-group" style={{ marginTop: '10px', marginLeft: '20px', marginRight: '20px', width: '300px' }}>
                        <input id="search" type="text" className="form-control" placeholder="Search for..." style={{ width: '300px' }} aria-describedby="basic-addon1" 
                            ref="searchInput" onChange={this.invokeSearch} />
                        <span className="input-group-btn">
                            <button id="search-button" className="btn btn-default" onClick={this.invokeSearch}>
                                Go!
                            </button>
                        </span>
                    </div>
                </div>
            </Navbar>
        )
    }
});

module.exports = SearchBar;