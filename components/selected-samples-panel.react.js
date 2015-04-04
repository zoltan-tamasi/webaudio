var React = require('react');

var Panel = require('react-bootstrap/lib/Panel');

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
    render: function() {
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
                </div>
            </Panel>
        )
    }
});

module.exports = SelectedSamplesPanel;