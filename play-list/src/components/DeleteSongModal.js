import React, { Component } from 'react';

export default class DeleteSongModal extends Component {
    render() {
        const { listKeyPair, deleteListCallback, hideDeleteListModalCallback } = this.props;
        let name = "";
        if (listKeyPair) {
            name = listKeyPair.name;
        }
        return (
            <div
                class="modal"
                id="delete-song-modal"
                data-animation="slideInOutLeft">
                <div class="modal-root" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Delete Song?
                    </div>
                    <div class="modal-center">
                        <div class="modal-center-content">
                            Are you sure you wish to permanently delete the {name} Song?
                        </div>
                    </div>
                    <div class="modal-south">
                        <input type="button"
                            id="delete-list-confirm-button"
                            class="modal-button"
                            onClick={deleteListCallback}
                            value='Confirm' />
                        <input type="button"
                            id="delete-list-cancel-button"
                            class="modal-button"
                            onClick={hideDeleteListModalCallback}
                            value='Cancel' />
                    </div>
                </div>
            </div>
        );
    }
}