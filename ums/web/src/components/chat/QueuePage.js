import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  IconButton,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { saveChatroomSettings } from '../../firebase/chatrooms';
import { getUserEmail } from '../../firebase/auth';
import Scoreboard from './Scoreboard';
import RPS from '../game-logic/RPS';
import {HOST} from '../game-logic/BackendServerLocation';

const useStyles = theme => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  backButton: {
    display: 'flex',
    float: 'left',
    position: 'relative',
    marginTop: theme.spacing(2),
    padding: 6,
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
  },
  topBar: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  topBarText: {
    fontWeight: 'bold',
    color: '#757575',
    lineHeight: '24px',
    fontSize: '14px',
    marginBottom: '0.5rem',
    marginTop: theme.spacing(3),
  },
  contentWrap: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    alignItems: 'flex-start',
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    overflow: 'auto',
  },
});

// QueuePage provides a queue/game hub page for the class.
// 
// Expected props:
//   - chatroomId: The current ID for the classroom.
//   - userIsAdmin: true/false. Helps us determine what options to display to the user.
//   - chatRoom: Object corresponding to our current classroom with several of the classroom's settings loaded up.
//   - hideSettings: handler to hide the settings page.
//   - hideClassroom: handler to hide the classroom page.
//   - showClassroom: handler to show the classroom page.
//   - hideQueue: handler to hide the queue page.
//
// Since the parent component (ChatPage) is already listening
// for changes to the chat document, we don't need to implement
// a separate listener here, as updates should flow from 
// ChatPage to QueuePage via props. However, if we ever decide
// to implement QueuePage as its own page, we'll most likely
// need to add a chatroom listener to this component as well.
class QueuePage extends Component {

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

    this.updateQueue = this.updateQueue.bind(this);
    this.handleCheckedChange = this.handleCheckedChange.bind(this);
    this.handleTextInputChange = this.handleTextInputChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.removeUserFromQueue = this.removeUserFromQueue.bind(this);
    this.addUserToQueue = this.addUserToQueue.bind(this);
  }

  componentDidMount() {
    this.addUserToQueue();
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.chatroomId !== nextProps.chatroomId) {
      this.setState({
        chatroomId: nextProps.chatroomId,
      });
      this.props.hideSettings();
      this.props.hideClassroom();
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

  updateQueue() {
    saveChatroomSettings(this.state.chatroomId, this.state.chatNameEditor, this.state.privateCheckbox, this.state.institutionEditor);
  }

  handleCheckedChange = name => event => {
    this.setState({ [name]: event.target.checked });
  }

  handleTextInputChange = name => event => {
    this.setState({ [name]: event.target.value });
  }

  addUserToQueue() {
    fetch(`${HOST}/scoreboard/user/create/${getUserEmail()}`, {method: 'POST', mode: 'no-cors'});
  }

  removeUserFromQueue() {
    fetch(`${HOST}/scoreboard/user/${getUserEmail()}`, {method: 'DELETE'});
  }

  toggleEdit() {
    if(this.state.editing) {
      this.updateQueue();
    }
    this.setState({
      editing: !this.state.editing,
    });
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.container}>
        <div className={classes.topBar}>
          {/* Back button */}
          <IconButton className={classes.backButton} onClick={() => {this.removeUserFromQueue(); this.props.hideQueue(); this.props.showClassroom();}} color="primary" component="span">
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h6" className={classes.topBarText}>{this.state.chatRoom.name + " Queue"}</Typography>
        </div>
        <div className={classes.contentWrap}>
          <Scoreboard userIsAdmin={this.props.userIsAdmin}/>
          <RPS />
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(QueuePage);
