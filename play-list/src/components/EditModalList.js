import React, { Component } from 'react';
import DBManager from '../db/DBManager';


export default class EditModalList extends Component {
    constructor(props) {
        super(props);

        this.db = new DBManager();

        let loadedSessionData = this.db.queryGetSessionData();

        this.state = {
            NewName: "",
            sessionData: loadedSessionData

        }
    }
    handleCancel = () => {
        this.props.hideEditListModalCallback()
    }
    handleConfirme = (e) => {
        const newCurrentList = {
            ...this.props.currentList,
            name: e.target.value,
        }
        this.props.editListName(this.props.currentList.key, newCurrentList)
        this.props.hideEditListModalCallback()
    }


    handleChangeName = (e) => {
        this.setState({
            ...this.state,
            NewName: e.target.value,
        })

        this.props.currentList.name = e.target.value;


    }

    render() {
        const { currentList, hideEditListModalCallback, editListName } = this.props;

        console.log("currentList", currentList)

        let Name = currentList?.name;

        this.state = {
            ...this.state,
            NewName: Name,
        }

        let NewName = this.state.NewName;


        console.log('currentList', currentList)
        console.log('state2', this.state)
        return (
            <div
                class="modal"
                id="edit-modal-list"
                data-animation="slideInOutLeft">
                <div class="modal-root-edit" id='verify-delete-list-root'>
                    <div class="modal-north">
                        Edit Modal
                    </div>
                    <div class="modal-center-edit">
                        <h5>Playlist Name</h5>
                        <input type="input"
                            id="elete-edit-input"
                            class="modal-button"
                            onChange={this.handleChangeName}
                            // value={this?.NewName}
                            value={NewName}
                        />
                    </div>
                    <div class="modal-south">

                        <div className='button-edit-confirm'>
                            <input type="button"
                                id="delete-list-confirm-button"
                                className="modal-button-edit-confirm"
                                // onClick={hideEditListModalCallback}
                                onClick={this.handleConfirme}
                                // value='Confirm'
                                value={NewName}
                                readOnly={false}
                            />
                            Confirm
                        </div>

                        <input type="button"
                            id="delete-list-cancel-button"
                            class="modal-button"
                            onClick={this.handleCancel}
                            value='Cancel' />
                    </div>
                </div>
            </div>
        );
    }
}