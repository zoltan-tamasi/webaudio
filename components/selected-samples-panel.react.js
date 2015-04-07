var React = require('react');

var Panel = require('react-bootstrap/lib/Panel');
var Input = require('react-bootstrap/lib/Input');
var Button = require('react-bootstrap/lib/Button');

var formatFileSize = function formatFileSize(filesize) {
    if (filesize >= 1000000) {
        return parseFloat(filesize / 1000000).toFixed(1) + " MB";
    }
    if (filesize > 1000) {
        return parseFloat(filesize / 1000).toFixed(1) + " KB";
    }
    return filesize;
}

var formatDuration = function formatDuration(duration) {
    var min = parseInt(duration / 60);
    if (min < 10) {
        min = "0" + min;
    }

    var sec = parseInt(duration % 60);
    if (sec < 10) {
        sec = "0" + sec;
    }

    return min + ":" + sec + "." + parseFloat(duration % 1).toFixed(1) * 10;
}

var SelectedSamplesPanel = React.createClass({
    saveNotes: function(event) {
        event.preventDefault();
        var notes = this.refs.notes.getValue();
        this.props.saveNotes(notes);
    },

    addTag: function(event) {
        event.preventDefault();
        var tagName = this.refs.tag.getValue();
        this.props.addTag(tagName);
    },

    toggleFavourite: function() {
        this.props.toggleFavourite();
    },

    componentDidUpdate: function() {
        var notes;
        if (!this.props.selectedSample) {
            notes = "";
        } else if (!this.props.selectedSample.userNotes) {
            notes = "";
        } else {
            notes = this.props.selectedSample.userNotes;
        }
        this.refs.notes.getInputDOMNode().value = notes;
    },

    render: function() {
        var removeLabel = "Remove from favourites";
        var addLabel = "Add as favourite";
        var toggleFavouriteLabel;

        if (!this.props.selectedIsFavourite) {
            toggleFavouriteLabel = addLabel;
        } else {
            toggleFavouriteLabel = removeLabel;
        }

        var noneIsSelected = !(this.props.selectedSample && this.props.selectedSample.id);

        return (
            <Panel header={( <h3>Selected sample</h3> )}>
                <div id="selected-sample" className="panel-body" style={{ minHeight : '337px' }}>
                    <table className="table" style={{ margin : "0px auto"}}>
                        <tr>
                            <td style={{ textAlign : "left" }}>name:</td>
                            <td style={{ textAlign : "left" }}>{this.props.selectedSample && this.props.selectedSample.name}</td>
                        </tr>
                        <tr>
                            <td>type:</td>
                            <td>{this.props.selectedSample && this.props.selectedSample.type}</td>
                        </tr>
                        <tr>
                            <td>channels:</td>
                            <td>{this.props.selectedSample && this.props.selectedSample.channels}</td>
                        </tr>
                        <tr>
                            <td>filesize:</td>
                            <td>{formatFileSize(this.props.selectedSample && this.props.selectedSample.filesize)}</td>
                        </tr>
                        <tr>
                            <td>bitrate:</td>
                            <td>{this.props.selectedSample && this.props.selectedSample.bitrate}</td>
                        </tr>
                        <tr>
                            <td>bitdepth:</td>
                            <td>{this.props.selectedSample && this.props.selectedSample.bitdepth}</td>
                        </tr>
                        <tr>
                            <td>duration:</td>
                            <td>{formatDuration(this.props.selectedSample && this.props.selectedSample.duration)}</td>
                        </tr>
                        <tr>
                            <td>samplerate:</td>
                            <td>{this.props.selectedSample && this.props.selectedSample.samplerate}</td>
                        </tr>
                    </table>
                    <form className={"form-horizontal " + (noneIsSelected ? 'hidden' : '') } onSubmit={this.saveNotes}>
                        <Input type='textarea' ref="notes" label="Notes" />
                        <Input type='submit' value='Save'/>
                    </form>
                    <form className={"form-horizontal " + (noneIsSelected ? 'hidden' : '') } onSubmit={this.addTag}>
                        <Input type='text' ref="tag" label="Add tag" />
                        <Input type='submit' value='Save'/>
                    </form>
                    <Button className={"form-horizontal " + (noneIsSelected ? 'hidden' : '') } onClick={this.toggleFavourite}>{toggleFavouriteLabel}</Button>
                </div>
            </Panel>
        )
    }
});

module.exports = SelectedSamplesPanel;