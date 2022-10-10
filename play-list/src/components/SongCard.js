import React from "react";

export default class SongCard extends React.Component {


    constructor(props) {
        super(props); 
        this.state = {
            text: this.props.keyNamePair.name,
            isDragging: false,
            draggedTo: false,  
        }
    }
    handleDragStart = (event) => {
        event.dataTransfer.setData("song", event.target.id);
        this.setState(prevState => ({
            isDragging: true,
            draggedTo: prevState.draggedTo
        }));
    }
    handleDragOver = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragEnter = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    handleDragLeave = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: false
        }));
    }
    handleDrop = (event) => {
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);

        this.setState(prevState => ({
            isDragging: false,
            draggedTo: false
        }));

        // ASK THE MODEL TO MOVE THE DATA
        this.props.moveCallback(sourceId, targetId);
    } 

    getItemNum = () => {
        return this.props.id.substring("playlist-song-".length);
    }
    handleDeleteList = (event) => {
        event.stopPropagation();
        this.props.deleteListCallback(this.props.song);
    }
    handleDoubleClick = (event) => {
        // console.log('doubleclick')
        this.props.EditCallback(this.props.song);


    }


    render() { 
        const { keyNamePair, song } = this.props;

        let num = this.getItemNum();

        let linkToItemHref = "https://www.youtube.com/watch?v=" + song.youTubeId;
        let itemClass = "playlister-song";
        if (this.state.draggedTo) {
            itemClass = "playlister-song-dragged-to";
        } 

        return (
            <div
                id={'song-' + num}
                className={itemClass}
                onDragStart={this.handleDragStart}
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                draggable="true" 
                onClick={this.handleDoubleClick}
                key={keyNamePair.key}
            >
                <div className="song-name">
                    {num}.
                    <a target="_blank" href={linkToItemHref}>
                        {song.title} by {song.artist}
                    </a> 
                </div>
                <input
                    type="button"
                    id={"delete-list-" + num}
                    className="list-card-button"
                    onClick={this.handleDeleteList}
                    value={"🗑"} />
            </div>
        ); 
    }
}