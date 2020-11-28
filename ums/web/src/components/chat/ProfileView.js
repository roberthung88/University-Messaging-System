import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  InputBase,
  IconButton,
  Tooltip
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { saveUserProfileImage, saveUserProfile } from '../../firebase/chatrooms';
import { loadUserProfile } from '../../firebase/chatrooms';
import { getUserUuid } from '../../firebase/auth';

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
  profileNameEditor: {
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
    resize: 'both',
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
  },
  test: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
});

// ProfileView displays a user's profile page.
// In the current implementation, ProfileView receives
// the uuid of a user that is going to be displayed
// and a handler to hide the profile page and go back
// to displaying the currently selected chat.
class ProfileView extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      name: "",
      institution: "",
    }
    this.updateProfile = this.updateProfile.bind(this);
    // this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.triggerChatIconUpload = this.triggerChatIconUpload.bind(this);
    // this.uploadChatIcon = this.uploadChatIcon.bind(this);
    this.loadUserProfileCallback = this.loadUserProfileCallback.bind(this);
  }

  componentDidMount() {
    loadUserProfile(this.props.uuid, this.loadUserProfileCallback);
  }

  componentWillReceiveProps(nextProps) {
    // if(this.state.chatroomId !== nextProps.chatroomId) {
    //   this.props.hideSettings();
    //   return;
    // }
    // if(!this.state.editing) {
    //   this.setState({
    //     chatroomId: nextProps.chatroomId,
    //     userIsAdmin: nextProps.userIsAdmin,
    //     chatRoom: nextProps.chatRoom,
    //     privateCheckbox: nextProps.chatRoom.private,
    //     institutionEditor: nextProps.chatRoom.institution,
    //     chatNameEditor: nextProps.chatRoom.name,
    //   });
    // } else {
    //   this.setState({
    //     chatroomId: nextProps.chatroomId,
    //     userIsAdmin: nextProps.userIsAdmin,
    //     chatRoom: nextProps.chatRoom,
    //   });
    // }
  }

  updateProfile() {
    saveUserProfile(this.state.name, this.state.institution);
  }

  handleCheckedChange = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  handleTextInputChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  toggleEdit() {
    if(this.state.editing) {
      this.updateProfile();
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

    saveUserProfileImage(file);
  }

  loadUserProfileCallback(snapshot) {
    const message = snapshot.data();
    this.setState({
      name: message.name,
      picUrl: message.profilePicUrl,
      email: message.email,
      institution: message.institution,
      loadedUserUuid: message.uuid,
    });
    // const name = message.name;
    // const picUrl = message.profilePicUrl;
    // const email = message.email;
    // const institution = message.institution;

    // const div = document.getElementById('profile');
    // // profile picture
    // if (picUrl) {
    //   div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
    // }

    // div.querySelector('.name').textContent = name;
    // div.querySelector('.email').textContent = email;
    // div.querySelector('.institution').textContent = "Institution: " + institution;

    // const majors = document.createElement('ul')
    // firebase.firestore().collection('users').doc(`${uuid}`).collection('majors').get().then((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     const li = document.createElement('li');
    //     li.textContent = doc.data().name;
    //     majors.appendChild(li);
    //   });
    // }).then(() => {
    //   div.querySelector('.majors').appendChild(majors);
    // });

    // const interests = document.createElement('ul')
    // firebase.firestore().collection('users').doc(`${uuid}`).collection('interests').get().then((snapshot) => {
    //   snapshot.forEach((doc) => {
    //     const li = document.createElement('li');
    //     li.textContent = doc.data().name;
    //     interests.appendChild(li);
    //   });
    // }).then(() => {
    //   div.querySelector('.interests').appendChild(interests);
    // });

    // Show the card fading-in and scroll to view the new message.
    // setTimeout(() => { div.classList.add('visible') }, 1);
    // messageInputElement.focus();
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.container}>
        {/* Back button */}
        <IconButton className={classes.backButton} onClick={() => {this.props.showProfileHandler(false, null)}} color="primary" component="span" disabled={this.state.editing}>
          <ArrowBackIcon />
        </IconButton>
        {/* Edit/Save button */}
        {this.state.loadedUserUuid === getUserUuid() &&
          <IconButton className={classes.editButton} onClick={this.toggleEdit} color="primary" component="span">
            {this.state.editing ?
              <SaveIcon />
              :
              <EditIcon />
            }
          </IconButton>
        }
        {/* Chatroom icon */} {/*this.triggerChatIconUpload should go in the place of the first null on the line below if we want to allow the user to change their profile picture. For now, everything is pulled from the Google servers.*/} 
        <div onClick={this.state.editing ? null : null} style={{display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '160px', height: '160px', textAlign: 'center', borderRadius: '100px', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '160px', backgroundImage: `${this.state.picUrl ? 'url(' + this.state.picUrl + ')' : 'url(/profile_placeholder.png)'}`}}>
          {/* <img src={this.state.chatRoom.picUrl ? this.state.chatRoom.picUrl : '/profile_placeholder.png'} className={classes.chatIcon} alt="Chat Icon" /> */}
          {/* {this.state.editing &&
            <div>
              <EditIcon className={classes.editChatIconButton} />
              <input hidden ref={input => this.chatIconCapture = input} type="file" accept="image/*" capture="camera" onChange={this.uploadChatIcon} />
            </div>
          } */}
        </div>
        {/* Profile name */}
        <div>
          <InputBase
            id="profile-name-editor"
            inputRef={this.ProfileNameTextInput}
            className={classes.profileNameEditor}
            margin="dense"
            value={this.state.name}
            onChange={this.handleTextInputChange('name')}
            disabled={!this.state.editing}
            placeholder="Chatroom Name"
            autoComplete='off'
          />
        </div>
        {/* Chatroom private/public */}
        {/* {this.state.editing ? 
          <div style={{display: 'block'}}>
            <FormControlLabel style={{marginLeft: 'auto', marginRight: 'auto'}} control={<Checkbox checked={this.state.privateCheckbox} onChange={this.handleCheckedChange('privateCheckbox')} name="privateCheckbox" color="primary"/>} label={<Typography variant="h6" className={classes.basicLabel} style={{paddingRight: 9}}>Private Chatroom</Typography>} />
          </div>
          :
          <Typography variant="h6" className={classes.basicLabel}>{this.state.chatRoom.private ? 'Private Chatroom' : 'Public Chatroom'}</Typography>
        } */}

        {/* Institution */}
        <Tooltip title="Institution" aria-label="institution">
          <InputBase
            id="institution-editor"
            inputRef={this.institutionTextInput}
            className={classes.basicEditor}
            fullWidth
            margin="dense"
            value={this.state.institution}
            onChange={this.handleTextInputChange('institution')}
            disabled={!this.state.editing}
            placeholder="Institution"
            autoComplete='off'
          />
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(useStyles)(ProfileView);
