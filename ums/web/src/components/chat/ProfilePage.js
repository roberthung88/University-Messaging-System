import React, { Component } from 'react';
import { Toolbar } from '@material-ui/core';
import { CssBaseline } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import ProfileView from './ProfileView';
import Navbar from './Navbar';

const useStyles = theme => ({
  root: {
    display: 'flex',
    backgroundColor: '#fff',
    width: '100%',
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  toolbar: {
    minHeight: '64px',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
});

// ProfilePage is the page wrapping component for the profile page. We assume that
// only logged-in users can access this page, so it should be guarded by
// a PrivateRoute.
//
// Expected props:
// - user: a firebase user object for the currently signed-in user.
// - uuid: a profile uuid that we are going to display.
// - showProfileHandler: a function that we can use to toggle whether or not we display a profile.
class ProfilePage extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <Navbar user={this.props.user} showProfileHandler={this.props.showProfileHandler}/>
        {/* <Selector
        user={this.props.user}
        chatroomId={this.state.chatroomId}
        setChatroom={this.setChatroom} /> */}
        <div className={classes.container}>
          <Toolbar className={classes.toolbar}/>
          <ProfileView
            uuid={this.props.uuid} 
            showProfileHandler={this.props.showProfileHandler}/>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(ProfilePage);
