import React from "react"; 

export default class EditToolbar extends React.Component { 


    render() {
        const { state, canAddSong, canUndo, canRedo, canClose,
            currentList, createNewSongCallback,
            undoCallback, redoCallback, closeCallback } = this.props; 

        let addSongClass = "toolbar-button";
        let undoClass = "toolbar-button ";
        let redoClass = "toolbar-button ";
        let closeClass = "toolbar-button";
        if (canAddSong) addSongClass += " disabled-add";
        if (canUndo) undoClass += " disabled";
        if (canRedo) redoClass += " disabled";
        if (canClose) closeClass += " disabled";
        return (
            <div id="edit-toolbar">
                <input
                    type="button"
                    id='add-song-button'
                    value="+"
                    className={addSongClass}
                    onClick={() => createNewSongCallback(currentList.key)}
                />
                <input
                    type="button"
                    id='undo-button'
                    value="⟲"
                    className={undoClass}
                    onClick={undoCallback}
                    disabled={state.history === null}
                />
                <input
                    type="button"
                    id='redo-button'
                    value="⟳"
                    className={redoClass}
                    onClick={redoCallback}
                    disabled={state.redo === null}
                />
                <input
                    type="button"
                    id='close-button'
                    value="&#x2715;"
                    className={closeClass}
                    onClick={closeCallback}
                    disabled={state.currentList === null}
                />
            </div>
        )
    }
}