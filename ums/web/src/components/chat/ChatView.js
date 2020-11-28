import React, { Component } from 'react';
import { 
  Toolbar,
  Typography,
  IconButton,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import { withStyles } from '@material-ui/core/styles';
import { getMessagesListener, getChatroomInfoListener } from '../../firebase/chatrooms';
import { getUserUuid } from '../../firebase/auth';
import Message from './Message';
import ComposeBar from './ComposeBar';
import ChatSettings from './ChatSettings';
import ClassroomPage from './ClassroomPage';
import QueuePage from './QueuePage';

const useStyles = theme => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  messagesWrap: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    flexGrow: 1,
    overflow: 'auto',
  },
  topBar: {
    // borderBottom: '1px solid rgb(212, 212, 212)',
    display:'flex',
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
  showChatSettings: {
    marginTop: theme.spacing(2),
    padding: 6,
  },
  toolbar: {
    minHeight: '64px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
});

// ChatView displays chat messages for a single Chatroom.
//
// Expected props:
// - chatroomId: the ID of the currently selected chatroom.
class ChatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messagesListener: null,
      chatroomListener: null,
      messageIndices: {},
      messages: [],
      chat: {},
      showSettings: false,
      showClassroom: false,
      showQueue: false,
      userIsAdmin: false,
      initialSet: false,
    };
    this.handleMessages = this.handleMessages.bind(this);
    this.handleChatroom = this.handleChatroom.bind(this);
    this.showSettings = this.showSettings.bind(this);
    this.hideSettings = this.hideSettings.bind(this);
    this.showClassroom = this.showClassroom.bind(this);
    this.hideClassroom = this.hideClassroom.bind(this);
    this.showQueue = this.showQueue.bind(this);
    this.hideQueue = this.hideQueue.bind(this);
  }

  // This function handles firestore snapshots of changes to the current chatroom's
  // messages collection. Assume for now that all additions come in chronological
  // order, so all added messages are appended to the end of the messages array.
  handleMessages(snapshot) {
    snapshot.docChanges().forEach(change => {
      let indices = this.state.messageIndices;
      let messages = this.state.messages;

      if (change.type === "removed") {
        const removeIndex = indices[change.doc.id];
        messages.splice(removeIndex, removeIndex + 1);
        delete indices[change.doc.id];
      } else if (change.type === "added") {
        // Add the document ID to the document's data before pushing to the list of messages.
        const data = Object.assign(change.doc.data(), { id: change.doc.id });
        indices[change.doc.id] = messages.push(data) - 1;
      } else {
        const data = Object.assign(change.doc.data(), { id: change.doc.id });
        const index = indices[change.doc.id];
        messages[index] = data;
      }
      this.setState({
        messageIndices: indices,
        messages: messages
      });
    });
  }

  // We have access to all of the chatroom metadata here. We can load and await updates for settings, etc here.
  handleChatroom(snapshot) {
    this.setState({
      chat: snapshot.data(),
      showClassroom: !this.state.initialSet && snapshot.data().isClassroom,
      initialSet: true,
      userIsAdmin: snapshot.data().adminsArr.includes(getUserUuid()),
    });
  };

  componentDidMount() {
    if (this.props.chatroomId) {
      this.setState({
        chatroomListener: getChatroomInfoListener(this.props.chatroomId, this.handleChatroom),
        messagesListener: getMessagesListener(this.props.chatroomId, this.handleMessages),
      });
    }
  }

  showSettings() {
    this.setState({ showSettings: true });
  }

  hideSettings() {
    this.setState({ showSettings: false });
  }

  showClassroom() {
    this.setState({ showClassroom: true });
  }

  hideClassroom() {
    this.setState({ showClassroom: false });
  }

  showQueue() {
    this.setState({ showQueue: true });
  }

  hideQueue() {
    this.setState({ showQueue: false });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatroomId !== this.props.chatroomId) {
      // If we have a new chatroom ID, we need to load in a new set of messages.
      // That means we may need to deregister our previous listener and make a
      // new one.
      if (this.state.messagesListener) {
        // Deregister old listener
        this.state.messagesListener();
      }
      if (this.state.chatroomListener) {
        // Deregister old listener
        this.state.chatroomListener();
      }
      this.setState({
        chatroomListener: getChatroomInfoListener(this.props.chatroomId, this.handleChatroom),
        messagesListener: getMessagesListener(this.props.chatroomId, this.handleMessages),
        messageIndices: {},
        messages: [],
        initialSet: false,
        showQueue: false,
      });
    }
  }

  render() {
    const classes = this.props.classes;

    // Choose main content to display (settings page or the chat messages themselves)
    //
    // TODO(nico/jordan): the Message view in the else statement should
    // probably be wrapped into its own component at some point to make
    // this code more readable.
    let content;
    if (this.state.showSettings) {
      content = (
        <div className={classes.container}>
          <Toolbar className={classes.toolbar}/>
          <ChatSettings chatroomId={this.props.chatroomId} userIsAdmin={this.state.userIsAdmin} chatRoom={this.state.chat} hideSettings={this.hideSettings} />
        </div>
      );
    } else if(this.state.showClassroom) {
      content = (
        <div className={classes.container}>
          <Toolbar className={classes.toolbar}/>
          <ClassroomPage chatroomId={this.props.chatroomId} userIsAdmin={this.state.userIsAdmin} chatRoom={this.state.chat} hideSettings={this.hideSettings} hideClassroom={this.hideClassroom} showQueue={this.showQueue} />
        </div>
      );
    } else if(this.state.showQueue) {
      content = (
        <div className={classes.container}>
          <Toolbar className={classes.toolbar}/>
          <QueuePage chatroomId={this.props.chatroomId} userIsAdmin={this.state.userIsAdmin} chatRoom={this.state.chat} hideSettings={this.hideSettings} hideClassroom={this.hideClassroom} showClassroom={this.showClassroom} hideQueue={this.hideQueue} />
        </div>
      );
    } else {
      const messages = this.state.messages.map(msg => (
        <Message key={msg.id} msg={msg} showProfileHandler={this.props.showProfileHandler}/>
      ));

      content = (
        <div className={classes.container}>
          {/* This toolbar provides spacing so that we don't put content under the navbar on accident. */}
          <Toolbar className={classes.toolbar}/>

          <div className={classes.topBar}>
            {this.state.chat.isClassroom && 
              <IconButton
              className={classes.showChatSettings}
              aria-label="Back to Class Home"
              onClick={this.showClassroom}
              color="primary"
              >
                <ArrowBackIcon style={{marginLeft: 2, marginRight: 2,}}/> {/* The margin left and right end up modifying the touch ripple width as well. This makes it perfectly round, because modifying the padding/margin of the actual button seemed to mess things up. */}
              </IconButton>
            }
            <Typography variant="h6" className={classes.topBarText}>{this.state.chat.name}</Typography>
            {!this.state.chat.isClassroom &&
              <IconButton
              className={classes.showChatSettings}
              aria-label="Show Chat Settings"
              onClick={this.showSettings}
              color="primary"
              >
                <InfoIcon style={{marginLeft: 2, marginRight: 2,}}/> {/* The margin left and right end up modifying the touch ripple width as well. This makes it perfectly round, because modifying the padding/margin of the actual button seemed to mess things up. */}
              </IconButton>
            }
          </div>

          <div className={classes.messagesWrap}>
            {messages}
          </div>
          <ComposeBar chatroomId={this.props.chatroomId}/>
        </div>
      );
    }

    return content;
  }
}

export default withStyles(useStyles)(ChatView);
