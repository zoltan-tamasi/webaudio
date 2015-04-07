var React = require('react');

var Navbar = require('react-bootstrap/lib/Navbar');

var Navigation = React.createClass({
    
    setSearchState: function() {
        this.props.setMainState("searchState");
    },

    setSamplesState: function() {
        this.props.setMainState("samplesState");
    },

    render: function() {
        var state = this.props.state;
        return (
            <Navbar brand="Webaudio app">
                <div id="navbar-inverse" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className={state == "searchState" ? "active" : ""} onClick={this.setSearchState}>
                            <a href="#">Search</a>
                        </li>
                        <li className={state == "samplesState" ? "active" : ""}>
                            <a href="#samples" onClick={this.setSamplesState}>Samples</a>
                        </li>
                    </ul>
                </div>
            </Navbar>
        );
    }
});

module.exports = Navigation;