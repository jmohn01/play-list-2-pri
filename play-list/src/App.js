import React from 'react';
import './App.css';
import { applyPatches } from "immer";

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './common/jsTPS.js';

// OUR TRANSACTIONS
import MoveSong_Transaction from './transactions/MoveSong_Transaction';

// THESE REACT COMPONENTS ARE MODALS
import DeleteListModal from './components/DeleteListModal';

import DeleteSongModal from './components/DeleteSongModal';

import EditModal from './components/EditModal';

import EditModalList from './components/EditModalList';




// THESE REACT COMPONENTS ARE IN OUR UI
import Banner from './components/Banner.js';
import EditToolbar from './components/EditToolbar.js';
import PlaylistCards from './components/PlaylistCards.js';
import SidebarHeading from './components/SidebarHeading.js';
import SidebarList from './components/SidebarList.js';
import Statusbar from './components/Statusbar.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    // THIS IS OUR TRANSACTION PROCESSING SYSTEM
    this.tps = new jsTPS();

    // THIS WILL TALK TO LOCAL STORAGE
    this.db = new DBManager();

    // GET THE SESSION DATA FROM OUR DATA MANAGER
    let loadedSessionData = this.db.queryGetSessionData();

    this.state = {
      listKeyPairMarkedForDeletion: null,
      currentList: null,
      songKeyPairMarkedForDeletion: null,
      sessionData: loadedSessionData,
      history: null,
      redo: null,
    }
  }
  sortKeyNamePairsByName = (keyNamePairs) => {
    keyNamePairs.sort((keyPair1, keyPair2) => {
      // GET THE LISTS
      return keyPair1.name.localeCompare(keyPair2.name);
    });
  }
  // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
  createNewList = () => {
    // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
    let newKey = this.state.sessionData.nextKey;
    let newName = "Untitled" + newKey;

    // MAKE THE NEW LIST
    let newList = {
      key: newKey,
      name: newName,
      songs: []
    };

    // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
    // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
    let newKeyNamePair = { "key": newKey, "name": newName, songs: [] };
    let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
    this.sortKeyNamePairsByName(updatedPairs);

    // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
    // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
    // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
    // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
    // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
    // SHOULD BE DONE VIA ITS CALLBACK
    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: newList,
      sessionData: {
        nextKey: prevState.sessionData.nextKey + 1,
        counter: prevState.sessionData.counter + 1,
        keyNamePairs: updatedPairs
      }
    }), () => {
      // PUTTING THIS NEW LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationCreateList(newList);

      // SO IS STORING OUR SESSION DATA
      this.db.mutationUpdateSessionData(this.state.sessionData);
    });
  }
  // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST.
  deleteList = (key) => {
    // IF IT IS THE CURRENT LIST, CHANGE THAT
    let newCurrentList = null;
    if (this.state.currentList) {
      if (this.state.currentList.key !== key) {
        // THIS JUST MEANS IT'S NOT THE CURRENT LIST BEING
        // DELETED SO WE'LL KEEP THE CURRENT LIST AS IT IS
        newCurrentList = this.state.currentList;
      }
    }

    let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
      return (keyNamePair.key === key);
    });
    let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
    if (keyIndex >= 0)
      newKeyNamePairs.splice(keyIndex, 1);

    // AND FROM OUR APP STATE
    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: null,
      currentList: newCurrentList,
      sessionData: {
        nextKey: prevState.sessionData.nextKey,
        counter: prevState.sessionData.counter - 1,
        keyNamePairs: newKeyNamePairs
      }
    }), () => {
      // DELETING THE LIST FROM PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationDeleteList(key);

      // SO IS STORING OUR SESSION DATA
      this.db.mutationUpdateSessionData(this.state.sessionData);
    });
  }
  deleteMarkedList = () => {
    this.deleteList(this.state.listKeyPairMarkedForDeletion.key);
    this.hideDeleteListModal();
  } 

  deleteMarkedSonng = () => {
    this.deleteSong(this.state.songKeyPairMarkedForDeletion.key);
    this.hideDeleteSongModal();
  } 
  // THIS FUNCTION SPECIFICALLY DELETES THE CURRENT LIST
  deleteCurrentList = () => {
    if (this.state.currentList) {
      this.deleteList(this.state.currentList.key);
    }
  }
  addSong = (key) => {
    // add new song
    console.log('key', key)
    // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
    let newKey = this.state.sessionData.nextKey;

    // MAKE THE NEW LIST
    let newSong = { key: newKey, title: 'Untitled', artist: 'Unknown', youTubeId: 'dQw4w9WgXcQ' };

    // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
    // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
    let newKeyNamePair = {
      ...this.state.currentList,
      songs: [...this.state.currentList.songs, newSong]
    };


    let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
      return (keyNamePair.key === key);
    });

    this.state.sessionData.keyNamePairs[keyIndex] = newKeyNamePair;

    let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
    this.sortKeyNamePairsByName(updatedPairs);

    // CHANGE THE APP STATE SO THAT THE CURRENT LIST IS
    // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
    // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
    // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
    // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
    // SHOULD BE DONE VIA ITS CALLBACK
    this.setState(prevState => ({
      songKeyPairMarkedForDeletion: prevState.songKeyPairMarkedForDeletion,
      currentList: {
        ...this.state.currentList,
        songs: [...this.state.currentList.songs, newSong]
      },
      history: this.state.currentList,
      sessionData: {
        nextKey: prevState.sessionData.nextKey + 1,
        counter: prevState.sessionData.counter + 1,
        keyNamePairs: this.state.sessionData.keyNamePairs
      }
    }), () => {
      // PUTTING THIS NEW LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationUpdateSong(newSong);

      // SO IS STORING OUR SESSION DATA
      this.db.mutationUpdateSessionData(this.state.sessionData);
    });
  }
  deleteSong = (key) => {
    // IF IT IS THE CURRENT LIST, CHANGE THAT

    let listKey = this.state.currentList.key;


    let newSongs = this.state.currentList.songs.filter((song) => {
      return (song.key !== key);
    });

    let newCurrentList = { ...this.state.currentList, songs: newSongs }

    let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
      return (keyNamePair.key === listKey);
    });

    this.state.sessionData.keyNamePairs[keyIndex] = newCurrentList;



    // AND FROM OUR APP STATE
    this.setState(prevState => ({
      songKeyPairMarkedForDeletion: null,
      currentList: newCurrentList,
      sessionData: {
        nextKey: prevState.sessionData.nextKey,
        counter: prevState.sessionData.counter - 1,
        keyNamePairs: this.state.sessionData.keyNamePairs
      }
    }), () => {
      // DELETING THE LIST FROM PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationDeleteList(key);

      // SO IS STORING OUR SESSION DATA
      this.db.mutationUpdateSessionData(this.state.sessionData);
    });
  }

  // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
  loadList = (key) => {
    let newCurrentList = this.db.queryGetList(key);

    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: newCurrentList,
      // history: newCurrentList,
      sessionData: this.state.sessionData
    }), () => {
      // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
      // THE TRANSACTION STACK IS CLEARED
      this.tps.clearAllTransactions();
    });
  }

  editListName = (key, list) => {
    let newCurrentList = this.db.queryGetList(key);
    console.log('songKey', key)


    let keyIndex = this.state.sessionData.keyNamePairs.findIndex((keyNamePair) => {
      return (keyNamePair.key == key);
    });

    console.log("key", key)

    this.state.sessionData.keyNamePairs[keyIndex] = list;

    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: list,
      sessionData: this.state.sessionData
    }), () => {
      // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
      // THE TRANSACTION STACK IS CLEARED
      this.db.mutationUpdateSessionData(this.state.sessionData);
    });
  }


  // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
  closeCurrentList = () => {
    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: null,
      history: prevState.currentList,
      sessionData: this.state.sessionData
    }), () => {
      // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
      // THE TRANSACTION STACK IS CLEARED
      this.tps.clearAllTransactions();
    });
  }
  setStateWithUpdatedList(list) {
    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: list,
      sessionData: this.state.sessionData
    }), () => {
      // UPDATING THE LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationUpdateList(this.state.currentList);
    });
  }
  getPlaylistSize = () => {
    return this.state.currentList.songs.length;
  }
  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  moveSong(start, end) {
    let list = this.state.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    start -= 1;
    end -= 1;
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    }
    else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }
    this.setStateWithUpdatedList(list);
  }
  // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
  addMoveSongTransaction = (start, end) => {
    let transaction = new MoveSong_Transaction(this, start, end);
    this.tps.addTransaction(transaction);
  }
  // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING AN UNDO
  undo = () => {
    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: prevState.history,
      redo: prevState.currentList,
      history: null,
      sessionData: this.state.sessionData
    }), () => {
      // UPDATING THE LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationUpdateList(this.state.currentList);
    });
  }

  // THIS FUNCTION BEGINS THE PROCESS OF PERFORMING A REDO
  redo = () => {
    this.setState(prevState => ({
      listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
      currentList: prevState.redo,
      history: prevState.currentList,
      redo: null,
      sessionData: this.state.sessionData
    }), () => {
      // UPDATING THE LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationUpdateList(this.state.currentList);
    });
  }
  markListForDeletion = (keyPair) => {
    this.setState(prevState => ({
      currentList: prevState.currentList,
      listKeyPairMarkedForDeletion: keyPair,
      sessionData: prevState.sessionData
    }), () => {
      // PROMPT THE USER
      this.showDeleteListModal();
    });
  }
  markSongForDeletion = (keyPair) => {
    this.setState(prevState => ({
      currentList: prevState.currentList,
      songKeyPairMarkedForDeletion: keyPair,
      sessionData: prevState.sessionData
    }), () => {
      // PROMPT THE USER
      this.showDeleteSongModal();
    });
  }

  markSongForEdit = (keyPair) => {
    this.setState(prevState => ({
      currentList: prevState.currentList,
      songKeyPairMarkedForDeletion: keyPair,
      sessionData: prevState.sessionData
    }), () => {
      // PROMPT THE USER
      this.showEditModal();
    });
  }
  markForEditList = (keyPair) => {
    this.setState(prevState => ({
      currentList: prevState.currentList,
      listKeyPairMarkedForDeletion: keyPair,
      sessionData: prevState.sessionData
    }), () => {
      // PROMPT THE USER
      this.showEditListModal();
    });
  }

  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
  showDeleteListModal() {
    let modal = document.getElementById("delete-list-modal");
    modal.classList.add("is-visible");
  }
  // THIS FUNCTION IS FOR HIDING THE MODAL
  hideDeleteListModal() {
    let modal = document.getElementById("delete-list-modal");
    modal.classList.remove("is-visible");
  }
  showDeleteSongModal() {
    let modal = document.getElementById("delete-song-modal");
    modal.classList.add("is-visible");
  }
  hideDeleteSongModal = () => {
    let modal = document.getElementById("delete-song-modal");
    modal.classList.remove("is-visible");
  };
  //EDIT MODAL

  hideEditModal = () => {
    let modal = document.getElementById("edit-modal");
    modal.classList.remove("is-visible");
    this.setState(prevState => ({
      ...prevState,
      history: prevState.currentList,
      redo: null,
    }), () => {
      // UPDATING THE LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.db.mutationUpdateSong(this.state.currentList.songs);

      this.db.mutationUpdateList(this.state.currentList);
    });
  };
  showEditModal() {
    let modal = document.getElementById("edit-modal");
    modal.classList.add("is-visible");
  }


  hideEditListModal = () => {
    let modal = document.getElementById("edit-modal-list");
    modal.classList.remove("is-visible");
  };
  showEditListModal() {
    let modal = document.getElementById("edit-modal-list");
    modal.classList.add("is-visible");
  }


  handleChangeTitle = (e) => {

    this.setState(prevState => ({
      ...prevState,
      currentList: {
        ...prevState.currentList,
        songs: prevState.currentList.songs.map(song => {
          if (song.key !== this.state.songKeyPairMarkedForDeletion.key) { return song } else { return this.state.songKeyPairMarkedForDeletion }
        })
      },
      history: prevState.currentList,
      redo: null,
      songKeyPairMarkedForDeletion: {
        ...this.state.songKeyPairMarkedForDeletion,
        title: e.target.value,
      }
    }), () => {
      // UPDATING THE LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.state.currentList.songs?.map(song =>
        this.db.mutationUpdateSong(song)

      )

      this.db.mutationUpdateList(this.state.currentList);
    });

  }

  handleChangeArtist = (e) => {

    this.setState(prevState => ({
      ...prevState,
      currentList: {
        ...prevState.currentList,
        songs: prevState.currentList.songs.map(song => {
          if (song.key !== this.state.songKeyPairMarkedForDeletion.key) { return song } else { return this.state.songKeyPairMarkedForDeletion }
        })
      },
      history: prevState.currentList,
      redo: null,
      songKeyPairMarkedForDeletion: {
        ...this.state.songKeyPairMarkedForDeletion,
        artist: e.target.value,
      }
    }), () => {
      // UPDATING THE LIST IN PERMANENT STORAGE
      // IS AN AFTER EFFECT
      this.state.currentList.songs?.map(song =>
        this.db.mutationUpdateSong(song)

      )

      this.db.mutationUpdateList(this.state.currentList);
    });

  }


  // track liste


  render() {
    console.log("state", this.state)
    let canAddSong = this.state.currentList !== null;
    let canUndo = this.tps.hasTransactionToUndo();
    let canRedo = this.tps.hasTransactionToRedo();
    let canClose = this.state.currentList !== null;
    return (
      <>
        <Banner />
        <SidebarHeading
          createNewListCallback={this.createNewList}
        />
        <SidebarList
          currentList={this.state.currentList}
          keyNamePairs={this.state.sessionData.keyNamePairs}
          deleteListCallback={this.markListForDeletion}
          loadListCallback={this.loadList}
          renameListCallback={this.renameList}
          markForEditList={this.markForEditList}

        />
        <EditToolbar
          canAddSong={canAddSong}
          state={this.state}
          currentList={this.state.currentList} 
          canUndo={canUndo}
          canRedo={canRedo}
          createNewSongCallback={this.addSong}
          canClose={canClose}
          undoCallback={this.undo}
          redoCallback={this.redo}
          closeCallback={this.closeCurrentList}
        />
        <PlaylistCards
          currentList={this.state.currentList}
          deleteListCallback={this.markSongForDeletion}
          moveSongCallback={this.addMoveSongTransaction}
          markSongForEdit={this.markSongForEdit}
        />
        <Statusbar
          currentList={this.state.currentList} />
        <DeleteListModal
          listKeyPair={this.state.listKeyPairMarkedForDeletion}
          hideDeleteListModalCallback={this.hideDeleteListModal}
          deleteListCallback={this.deleteMarkedList}
        />
        <DeleteSongModal
          listKeyPair={this.state.listKeyPairMarkedForDeletion}
          hideDeleteListModalCallback={this.hideDeleteSongModal}
          deleteListCallback={this.deleteMarkedSonng}
        />
        <EditModal
          hideEditModalCallback={this.hideEditModal}
          songKeyPairMarkedForDeletion={this.state.songKeyPairMarkedForDeletion}
          handleChangeTitle={this.handleChangeTitle}
          handleChangeArtist={this.handleChangeArtist}
        />
        <EditModalList
          hideEditListModalCallback={this.hideEditListModal}
          currentList={this.state.listKeyPairMarkedForDeletion}
          editListName={this.editListName}
        />
      </>
    );
  }
}

export default App;
