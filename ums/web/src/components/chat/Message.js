import React, { Component } from 'react';
import {
  Avatar,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Lightbox } from "react-modal-image";

const useStyles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.5rem',
  },
  textWrap: {
    marginLeft: '0.5rem',
  },
  nameLink: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontWeight: 'bold',
    textDecoration: 'none',
    cursor: 'pointer',
  },
  imageWrap: {
    marginLeft: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
});

// Message is useful for displaying a single chat message.
//
// Expected props:
// - msg: an object corresponding to a message that should have the following keys defined:
//   - name: the name of the person who sent the message
//   - text: the text of the message itself
//   OR - imageUrl: the url of the image the user uploads
//   - profilePicUrl: the URL for the user's profile picture
class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imageUrl: "",
      openImage: false,
    };

    this.preventDragHandler = this.preventDragHandler.bind(this);
    this.setImageAndOpen = this.setImageAndOpen.bind(this);
    this.closeImage = this.closeImage.bind(this);
  }

  preventDragHandler = (e) => {
    e.preventDefault();
  }

  setImageAndOpen(url) {
    this.setState({
      imageUrl: url,
      openImage: true,
    });
  }

  closeImage() {
    this.setState({
      openImage: false,
    })
  }

  render() {
    const classes = this.props.classes;
    const msg = this.props.msg;
    if(msg.text) {
      return (
        <div className={classes.container}>
          <Avatar onDragStart={this.preventDragHandler} src={msg.profilePicUrl} alt={msg.name}/>
          <div className={classes.textWrap}>
            {/* <Typography variant="caption">{msg.name}</Typography> */}
            <a className={classes.nameLink} onClick={() => this.props.showProfileHandler(true, msg.userId)}>
            {msg.name}
            </a>
            <Typography>{msg.text}</Typography>
          </div>
        </div>
      );
    } else {
      return (
        <div className={classes.container}>
          <Avatar onDragStart={this.preventDragHandler} src={msg.profilePicUrl} alt={msg.name}/>
          <div className={classes.imageWrap}>
            {/* <Typography variant="caption">{msg.name}</Typography> */}
            <a className={classes.nameLink} onClick={() => this.props.showProfileHandler(true, msg.userId)}>
              {msg.name}
            </a>
            <img onClick={() => this.setImageAndOpen(msg.imageUrl)} src={msg.imageUrl + '&' + new Date().getTime()} alt="Upload" style={{ maxWidth: 300, maxHeight: 200, verticalAlign: 'middle'}} />
          </div>
          {this.state.openImage &&
            <Lightbox large={this.state.imageUrl} onClose={() => this.closeImage()} imageBackgroundColor="none" hideZoom="true"/>
          }
        </div>
      );
    }
  }
}

export default withStyles(useStyles)(Message);
