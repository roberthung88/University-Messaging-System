import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Selector from './Selector';
import ChatView from './ChatView';
import ProfilePage from './ProfilePage';
import Navbar from './Navbar';
import { checkUserData } from '../../firebase/chatrooms';

const useStyles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: '#fff',
    width: '100%',
  },
});

// ChatPage is the page wrapping component for the chat page. We assume that
// only logged-in users can access this page, so it should be guarded by
// a PrivateRoute.
//
// Expected props:
// - user: a firebase user object for the currently signed-in user.
class ChatPage extends Component {
  constructor(props) {
    super(props);
    // ChatPage tracks the active chatroomId, but the state of
    // chatroomId is currently exclusively controlled by the Selector
    // component via the setChatroom prop.
    this.state = {
      chatroomId: null,
      uuid: null,
      showProfile: false,
      showSelector: true,
    };
    this.setChatroom = this.setChatroom.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.toggleSelector = this.toggleSelector.bind(this);

    this.checkUserData = this.checkUserData.bind(this);
    this.checkUserData();
  }

  checkUserData() {
    checkUserData();
  }
  
  setChatroom(chatroomId) {
    this.setState({
      chatroomId: chatroomId,
    });
  }

  showProfile(show, uuid) {
    this.setState({
      showProfile: show,
      uuid: uuid,
    });
  }

  toggleSelector() {
    this.setState({
      showSelector: !this.state.showSelector,
    });
  }

  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Navbar user={this.props.user} showProfileHandler={this.showProfile} toggleSelectorHandler={this.toggleSelector}/>
        {this.state.showProfile ?
        <ProfilePage user={this.props.user} uuid={this.state.uuid} showProfileHandler={this.showProfile}/>
        :
        (
          <div className={classes.root}>
            {this.state.showSelector && 
              <Selector
              user={this.props.user}
              chatroomId={this.state.chatroomId}
              setChatroom={this.setChatroom} /> }
            <ChatView
            user={this.props.user}
            chatroomId={this.state.chatroomId} 
            showProfileHandler={this.showProfile}/>
          </div>
        )
        }
      </div>
    );
  }
}

export default withStyles(useStyles)(ChatPage);
