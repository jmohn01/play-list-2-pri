import React, { Component } from 'react';
import DBManager from '../db/DBManager';


export default class EditModal extends Component {

    handleCancel = () => {
        this.setState({
            ...this.state,
            newTitle: "",
            newArtist: "",
        })
        this.props.hideEditModalCallback()
    }


    render() {
        const { handleChangeTitle, handleChangeArtist, songKeyPairMarkedForDeletion, hideEditModalCallback } = this.props;


        return (
            <div
                class="modal"
                id="edit-modal"
                data-animation="slideInOutLeft">
                <div class="modal-root-edit" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Edit Modal
                    </div>
                    <div class="modal-center-edit">
                        <h5>Title</h5>
                        <input type="input"
                            id="elete-edit-input"
                            class="modal-button"
                            onChange={handleChangeTitle}
                            value={songKeyPairMarkedForDeletion?.title}
                        />
                        <h5>Artist</h5>
                        <input type="input"
                            id="elete-edit-input"
                            class="modal-button"
                            onChange={handleChangeArtist}
                            value={songKeyPairMarkedForDeletion?.artist}
                        />
                    </div>
                    <div class="modal-south">
                        <input type="button"
                            id="delete-list-confirm-button"
                            class="modal-button" 
                            onClick={hideEditModalCallback}
                            value='Confirm' />
                        <input type="button"
                            id="delete-list-cancel-button"
                            class="modal-button"
                            onClick={hideEditModalCallback}
                            value='Cancel' />
                    </div>
                </div>
            </div>
        );
    }
}