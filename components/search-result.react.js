var React = require('react/addons');

var SearchResult = React.createClass({
    selectSample: function() {
        this.props.selectSample(this.props.audio.id);
    },

    removeTag: function(e) {
        console.log(e);
    },

    render: function() {
        var tags = this.props.audio.tags.slice(0, 8).map(function(tag) {
            return (
                <span className="badge" style={{ marginRight: '5px' }} >
                    {tag}
                </span>
            );
        });

        var userTags = this.props.userTags && this.props.userTags.map(function(tag) {
            return (
                <span className="badge" style={{ marginRight: '5px', backgroundColor: 'rgb(134, 195, 44)' }} >
                    {tag}
                </span>
            );
        });

        var cx = React.addons.classSet;
        var classes = cx({
            'list-group-item': true,
            'active': this.props.active
        });

        return (
            <div className={classes} style={{ cursor: "pointer" }} onClick={this.selectSample}>
                <h5 className="list-group-item-heading">
                    <span>{this.props.audio.name}</span>
                    <small>
                        <span>
                            &nbsp;&nbsp;license: <a href={this.props.audio.license}>{this.props.audio.license}</a>
                        </span>
                    </small>
                </h5>
                <p className="list-group-item-text">
                    {tags} {userTags}
                </p>
            </div>
        );
    }
});

module.exports = SearchResult;
