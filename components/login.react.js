var React = require('react');

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var Button = require('react-bootstrap/lib/Button');
var ButtonGroup = require('react-bootstrap/lib/ButtonGroup');

var Login = React.createClass({
    login: function() {
        var email = this.refs.email.getValue();
        var password = this.refs.password.getValue();

        this.props.login(email, password);
    },

    regUser: function() {
        var email = this.refs.email.getValue();
        var password = this.refs.password.getValue();

        this.props.regUser(email, password);
    },

    render: function() {
        return (
            <Row>
                <Col md={4} sm={4} xs={12} mdOffset={4} smOffset={4} xsOffset={2}>
                    <Panel header={(<h3>Login</h3>)}>
                        <Input type="text" placeholder="E-mail" label="E-mail" ref="email"/>
                        <Input type="password" placeholder="Password" label="Password" ref="password"/>
                        <div style={{ textAlign: "center" }}>
                            <ButtonGroup>
                                <Button onClick={ this.login }>Login</Button>
                                <Button onClick={ this.regUser}>Register</Button>
                            </ButtonGroup>
                        </div>
                    </Panel>
                </Col>
            </Row>
        );
    }
});

module.exports = Login;