import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  InputBase,
  IconButton,
  FormControlLabel,
  Checkbox,
  Tooltip
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { saveChatroomImage, saveChatroomSettings } from '../../firebase/chatrooms';
import MemberView from './MemberView';

const useStyles = theme => ({
  container: {
    marginTop: theme.spacing(1.5),
    textAlign: 'center',
  },
  backButton: {
    display: 'block',
    float: 'left',
    position: 'relative',
  },
  editButton: {
    display: 'flex',
    float: 'right',
    position: 'relative',
  },
  editChatIconButton: {
    float: 'center',
    position: 'relative',
    top: 8,
    marginTop: 'calc(75px - 36px + 18px)',
    color: 'rgba(0,0,0,.87)',
    fontSize: '36px',
  },
  chatIcon: {
    position: 'relative',
  },
  chatNameEditor: {
    fontSize: '2rem',
    lineHeight: '36px',
    color: '#757575',
    fontWeight: 'bold',
    marginLeft: 'auto',
    marginRight: 'auto',
    align: "center",
    '& input': {
      textAlign: "center",
    },
    '& input:disabled': {
      color: '#757575',
    }
  },
  basicEditor: {
    fontSize: '1rem',
    lineHeight: '18px',
    color: '#757575',
    fontWeight: 'regular',
    marginLeft: 'auto',
    marginRight: 'auto',
    align: "center",
    '& input': {
      textAlign: "center",
    },
    '& input:disabled': {
      color: '#757575',
    }
  },
  basicLabel: {
    fontSize: '1rem',
    color: '#757575',
    lineHeight: '18px',
    fontWeight: 'regular',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: '12px',
    paddingBottom: '12px',
    cursor: 'default',
  }
});

// ChatSettings provides an info/settings page for the chat.
// In the current implementation, ChatSettings receives
// data about the current chat as a prop, and updates info
// about the current chat via Firebase functions.
//
// Since the parent component (ChatPage) is already listening
// for changes to the chat document, we don't need to implement
// a separate listener here, as updates should flow from 
// ChatPage to ChatSettings via props. However, if we ever decide
// to implement ChatSettings as its own page, we'll most likely
// need to add a chatroom listener to this component as well.
class ChatSettings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      privateCheckbox: this.props.chatRoom.private,
      chatroomId: this.props.chatroomId,
      userIsAdmin: this.props.userIsAdmin,
      chatRoom: this.props.chatRoom,
      institutionEditor: this.props.chatRoom.institution,
      chatNameEditor: this.props.chatRoom.name,
    }

    this.updateSettings = this.updateSettings.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.triggerChatIconUpload = this.triggerChatIconUpload.bind(this);
    this.uploadChatIcon = this.uploadChatIcon.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.chatroomId !== nextProps.chatroomId) {
      this.setState({
        chatroomId: nextProps.chatroomId,
      });
      this.props.hideSettings();
      return;
    }
    if(!this.state.editing) {
      this.setState({
        chatroomId: nextProps.chatroomId,
        userIsAdmin: nextProps.userIsAdmin,
        chatRoom: nextProps.chatRoom,
        privateCheckbox: nextProps.chatRoom.private,
        institutionEditor: nextProps.chatRoom.institution,
        chatNameEditor: nextProps.chatRoom.name,
      });
    } else {
      this.setState({
        chatroomId: nextProps.chatroomId,
        userIsAdmin: nextProps.userIsAdmin,
        chatRoom: nextProps.chatRoom,
      });
    }
  }

  updateSettings() {
    saveChatroomSettings(this.state.chatroomId, this.state.chatNameEditor, this.state.privateCheckbox, this.state.institutionEditor);
  }

  handleCheckedChange = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  handleTextInputChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  toggleEdit() {
    if(this.state.editing) {
      this.updateSettings();
    }
    this.setState({
      editing: !this.state.editing,
    });
  }

  triggerChatIconUpload() {
    this.chatIconCapture.click();
  }

  uploadChatIcon(e) {
    e.preventDefault();
    const file = e.target.files[0];
    // Check if the file is an image.
    if (!file.type.match('image.*')) {
      return;
    }

    saveChatroomImage(this.state.chatroomId, file);
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.container}>
        {/* Back button */}
        <IconButton className={classes.backButton} onClick={this.props.hideSettings} color="primary" component="span" disabled={this.state.editing}>
          <ArrowBackIcon />
        </IconButton>
        {/* Edit/Save button */}
        {this.state.userIsAdmin &&
          <IconButton className={classes.editButton} onClick={this.toggleEdit} color="primary" component="span">
            {this.state.editing ?
              <SaveIcon />
              :
              <EditIcon />
            }
          </IconButton>
        }
        {/* Chatroom icon */}
        <div onClick={this.state.editing ? this.triggerChatIconUpload : null} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '160px', height: '160px', textAlign: 'center', borderRadius: '100px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '160px', backgroundImage: `${this.state.chatRoom.chatIconUrl ? 'url(' + this.state.chatRoom.chatIconUrl + ')' : 'url(/chat_placeholder.png)'}`}}>
          {/* <img src={this.state.chatRoom.picUrl ? this.state.chatRoom.picUrl : '/profile_placeholder.png'} className={classes.chatIcon} alt="Chat Icon" /> */}
          {
          this.state.editing &&
            <div>
              <EditIcon className={classes.editChatIconButton} />
              <input hidden ref={input => this.chatIconCapture = input} type="file" accept="image/*" capture="camera" onChange={this.uploadChatIcon} />
            </div>
          }
        </div>
        {/* Chatroom name */}
        <InputBase
          id="chat-name-editor"
          inputRef={this.chatNameTextInput}
          className={classes.chatNameEditor}
          margin="dense"
          value={this.state.chatNameEditor}
          onChange={this.handleTextInputChange('chatNameEditor')}
          disabled={!this.state.editing}
          placeholder="Chatroom Name"
          autoComplete='off'
        />
        {/* Chatroom private/public */}
        {this.state.editing ? 
          <div style={{display: 'block'}}>
            <FormControlLabel style={{marginLeft: 'auto', marginRight: 'auto'}} control={<Checkbox checked={this.state.privateCheckbox} onChange={this.handleCheckedChange('privateCheckbox')} name="privateCheckbox" color="primary"/>} label={<Typography variant="h6" className={classes.basicLabel} style={{paddingRight: 9}}>Private Chatroom</Typography>} />
          </div>
          :
          <Typography variant="h6" className={classes.basicLabel}>{this.state.chatRoom.private ? 'Private Chatroom' : 'Public Chatroom'}</Typography>
        }

        {/* Institution */}
        <Tooltip title="Institution" aria-label="institution">
          <InputBase
            id="institution-editor"
            inputRef={this.institutionTextInput}
            className={classes.basicEditor}
            margin="dense"
            value={this.state.institutionEditor}
            onChange={this.handleTextInputChange('institutionEditor')}
            disabled={!this.state.editing}
            placeholder="Institution"
            autoComplete='off'
          />
        </Tooltip>

        <MemberView type="Chat" chatroomId={this.state.chatroomId} userIsAdmin={this.state.userIsAdmin} />
      </div>
    );
  }
}

export default withStyles(useStyles)(ChatSettings);
