import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';
import { sendMessage, sendImageMessage } from '../../firebase/chatrooms';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0.5rem 0px',
    alignItems: 'flex-end',
  },
  textEditor: {
    flexGrow: 1,
    marginRight: '0.5rem',
  },
  msgSend: {
    marginRight: '1rem',
    marginBottom: '0.25rem',
    height: 40,
  },
  imgInput: {
    display: 'none',
  },
  imgButton: {
    marginLeft: 0,
  },
});

class ComposeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: "",
    };
    this.state = {
      image: null
    };
    // Createa a ref to store the text input DOM element
    this.messageTextInput = React.createRef();

    this.handleKeypress = this.handleKeypress.bind(this);
    this.updateMsg = this.updateMsg.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.focusMessageTextInput = this.focusMessageTextInput.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
  }

  handleKeypress(event) {
    // If the enter key was pressed.
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      this.sendMsg();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeypress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeypress, false);
  }

  updateMsg(event) {
    event.preventDefault();
    this.setState({ msg: event.target.value });
  }

  sendMsg() {
    // Make sure the user actually entered a message to send and it's not just spaces or empty lines
    if(this.state.msg && this.state.msg.trim().length > 0) {
      sendMessage(this.props.chatroomId, this.state.msg);

      // Clear the message
      this.setState({ msg: "" });
    }

    // Focus the text message input that way the user can continue typing a new message without having to click the text input
    this.focusMessageTextInput();
  }

  focusMessageTextInput() {
    this.messageTextInput.current.focus();
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];

      if(!img.type.match('image.*')) {
        console.log('You can only share images');
        return;
      }

      sendImageMessage(this.props.chatroomId, img);
    }
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.container}>
        <input onChange={this.onImageChange} accept="image/*" className={classes.imgInput} id="icon-button-file" type="file" />
        <label htmlFor="icon-button-file" className={classes.imgButton}>
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
        <TextField
          id="msg-editor"
          inputRef={this.messageTextInput}
          className={classes.textEditor}
          label="Message"
          multiline
          rowsMax={4}
          margin="dense"
          variant="outlined"
          value={this.state.msg}
          onChange={this.updateMsg}
        />
        <Button onClick={this.sendMsg} color="primary" className={classes.msgSend} variant="contained">Send</Button>
      </div>
    );
  }
}

export default withStyles(useStyles)(ComposeBar);
