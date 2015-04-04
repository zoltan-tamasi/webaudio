var React = require('react');

var Navbar = require('react-bootstrap/lib/Navbar');

var Navigation = React.createClass({
    render: function() {
        return (
            <Navbar brand="Webaudio app">
                <div id="navbar-inverse" className="collapse navbar-collapse">
                    <ul className="nav navbar-nav">
                        <li className="active">
                            <a href="#">Search</a>
                        </li>
                        <li>
                            <a href="#samples">Samples</a>
                        </li>
                    </ul>
                </div>
            </Navbar>
        );
    }
});

module.exports = Navigation;