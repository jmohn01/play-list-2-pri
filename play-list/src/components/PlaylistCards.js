import SongCard from './SongCard.js';
import React from "react";

export default class PlaylistCards extends React.Component {
    render() {
        const { currentList, deleteListCallback,
            moveSongCallback, markSongForEdit } = this.props;
        if (currentList === null) {
            return (
                <div id="playlist-cards"></div>
            )
        }
        else {
            return (
                <div id="playlist-cards">
                    {
                        currentList?.songs?.map((song, index) => (
                            <SongCard
                                id={'playlist-song-' + (index+1)}
                                key={'playlist-song-' + (index+1)}
                                keyNamePair={index}
                                selected={(currentList !== null) && (currentList.key === index.key)}
                                song={song}
                                deleteListCallback={deleteListCallback}
                                moveCallback={moveSongCallback}
                                EditCallback={markSongForEdit}
                            />
                        ))
                    }
                </div>
            )
        }
    }
}