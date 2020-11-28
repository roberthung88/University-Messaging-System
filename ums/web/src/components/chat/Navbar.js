import React, { Component } from 'react';
import { 
  AppBar,
  Avatar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { logout } from '../../firebase/auth';

const useStyles = theme => ({
  root: {
    display: 'flex',
    position: 'relative',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  appBarTitle: {
    flexDirection: 'row',
    flexGrow: 1,
  },
  appBarAvatar: {
    height: '2rem',
    width: '2rem'
  },
  umsLogo: {
    height: '2.5rem',
    overflow: 'hidden'
  },
  logoutButton: {
    marginLeft: 'auto',
  },
  menu: {
    position: 'absolute',
    width: '150px',
    top: '4rem',
    right: '0',
    zIndex: theme.zIndex.drawer + 2,
    marginBottom: '0px',
    marginLeft: 'auto',
    marginRight: '0px',
    color: '#000',
  },
  menuButton: {
    height: 40,
    width: '150px',
    borderRadius: '0',
  },
  menuButtonLast: {
    height: 40,
    width: '150px',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  menuList: {
    marginTop: '0',
    marginBottom: '0',
    width: '150px',
    padding: 0,
    listStyle: 'none',
    textAlign: 'right',
  },
  toolbar: {
    minHeight: '64px',
    paddingLeft: '16px',
    paddingRight: '16px',
  }
});

// Navbar provides a navbar for the Chat page.
//
// Expected props:
// - user: the currently logged in firebase user.
// - showProfileHandler: a function that we can use to toggle whether or not we display a profile.
class Navbar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showMenu: false,
    };

    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.preventDragHandler = this.preventDragHandler.bind(this);
  }

  showMenu(event) {
    event.preventDefault();
    
    this.setState({
      showMenu: true,
    }, () => {
      document.addEventListener('click', this.hideMenu);
    });
  }

  hideMenu(event) {
    // Commented out because we want to hide the menu regardless
    // of what the user clicks. If this changes in the future,
    // just uncomment the if statement and the menu will stay
    // displayed until the user clicks away from it.
    // if(!this.profileDropdownMenu.contains(event.target)) {
      this.setState({
        showMenu: false,
      }, () => {
        document.removeEventListener('click', this.hideMenu);
      });
    // }
  }

  preventDragHandler = (e) => {
    e.preventDefault();
  }

  render() {
    const classes = this.props.classes;

    return (
      <div>
        <AppBar
        position="fixed"
        className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <IconButton
            onClick={() => {this.props.toggleSelectorHandler()}}
            edge="start"
            color="inherit"
            aria-label="menu">
              <MenuIcon />
            </IconButton>
            {/* <Typography variant="h6" noWrap className={classes.appBarTitle}>University Messaging System</Typography> */}
            <img src='/ums_logo.png' onDragStart={this.preventDragHandler} className={classes.umsLogo} alt="University Messaging System" />
            <Button className={classes.logoutButton} color="inherit" onClick={this.showMenu}>
              <Avatar
              onDragStart={this.preventDragHandler}
              className={classes.appBarAvatar}
              alt={this.props.user.displayName}
              src={this.props.user.photoURL}></Avatar>
              <Typography style={{textTransform: 'none', display: 'end', marginLeft:'0.5rem'}}>{this.props.user.displayName.split(' ')[0]}</Typography>
            </Button>
          </Toolbar>
        </AppBar>
        {this.state.showMenu &&
            <div className={classes.menu} ref={(element) => {this.profileDropdownMenu = element;}}>
              <ul className={classes.menuList}>
                <li><Button className={classes.menuButton} color="primary" variant="contained" onClick={() => {this.props.showProfileHandler(true, this.props.user.uid)}}> My Profile </Button></li>
                <li><Button className={classes.menuButtonLast} color="primary" variant="contained" onClick={logout}> Sign Out </Button></li>
              </ul>
            </div>
          }
      </div>
    );
  }
}

export default withStyles(useStyles)(Navbar);
