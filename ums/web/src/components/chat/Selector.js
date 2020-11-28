import React, { Component } from 'react';
import {
  Drawer,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Toolbar,
  Typography,
  Avatar,
  ListItemText,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { getChatroomsListener } from '../../firebase/chatrooms';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import { createChatroom, createClassroom } from '../../firebase/chatrooms';
import { getUserUuid } from '../../firebase/auth';

const drawerWidth = 240;
const useStyles = theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#f3f3f3',
    borderRight: 'none',
  },
  drawerContainer: {
    paddingTop: theme.spacing(3),
    overflow: 'auto',
  },
  messagesContainer: {
    // borderBottom: '1px solid rgb(212, 212, 212)',
    flexDirection: 'row',
  },
  chatHeader: {
    marginLeft: '1rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#757575',
    lineHeight: '24px',
    fontSize: '14px',
    width: '75%',
    display: 'inline'
  },
  newChatroomButton: {
    display: 'inline',
    float: 'right',
    marginTop: '-12px',
  },
  chat: {
    '&:hover': {
      backgroundColor: '#e8e8e8',
    },
  },
  rooms: {
    paddingTop: 0,
  },
  selectedChat: {
    backgroundColor: '#fff',
  },
  chatroomName: {
    color: '#757575',
    lineHeight: '18px',
    fontSize: '1rem',
    fontWeight: '400',
  },
  chatroomTimestamp: {
    color: '#bbb',
    lineHeight: '18px',
    fontSize: '12px',
  },
  menu: {
    position: 'absolute',
    width: '150px',
    top: '7.75rem',
    right: '0',
    zIndex: theme.zIndex.drawer + 2,
    marginBottom: '0px',
    marginLeft: 'auto',
    marginRight: '0px',
    color: '#000',
  },
  menuList: {
    marginTop: '0',
    marginBottom: '0',
    width: '150px',
    padding: 0,
    listStyle: 'none',
    textAlign: 'right',
  },
  menuButton: {
    height: 40,
    width: '150px',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  },
  menuButtonLast: {
    height: 40,
    width: '150px',
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  toolbar: {
    minHeight: '64px',
    paddingLeft: '16px',
    paddingRight: '16px',
  }
});

class Selector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // We rely on the fact that modern Javascript implementations all
      // preserve a deterministic ordering for Objects. In the future,
      // if we want to order on more explicit parameters, this implementation
      // may need to change into something closer to the state management
      // solution used in ChatView.
      chatrooms: {},
    };
    this.handleChatrooms = this.handleChatrooms.bind(this);
    this.createNewChatroom = this.createNewChatroom.bind(this);
    this.createNewClassroom = this.createNewClassroom.bind(this);
    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
  }

  handleChatrooms(snapshot) {
    snapshot.docChanges().forEach(change => {
      let newChatrooms = this.state.chatrooms;
      if (change.type === "removed") {
        delete newChatrooms[change.doc.id];
      } else {
        newChatrooms[change.doc.id] = change.doc.data();
      }
      this.setState({chatrooms: newChatrooms});

      // Select an initial chatroomId if none have been selected.
      if (!this.props.chatroomId && this.state.chatrooms) {
        this.props.setChatroom(Object.keys(this.state.chatrooms)[0]);
      }
    });
  }

  createNewChatroom() {
    createChatroom(getUserUuid(), true, []).then(docRef => {
      this.props.setChatroom(docRef.id);
    });
  }

  createNewClassroom() {
    createClassroom(getUserUuid(), true, []).then(docRef => {
      this.props.setChatroom(docRef.id);
    });
  }

  componentDidMount() {
    getChatroomsListener(this.props.user.uid, this.handleChatrooms);
  }

  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
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

  render() {
    const classes = this.props.classes;
    const rooms = Object.entries(this.state.chatrooms).map(
      (entry) => {
        const [id, chatroom] = entry;
        let className = classes.chat; 
        if (id === this.props.chatroomId) {
          className += ` ${classes.selectedChat}`;
        }
        return (
        <ListItem button className={className} key={id} onClick={() => this.props.setChatroom(id)}>
          <ListItemAvatar>
            <Avatar src={chatroom.chatIconUrl} alt={chatroom.name} />
          </ListItemAvatar>
          <ListItemText primary={<Typography className={classes.chatroomName} >{chatroom.name}</Typography>} secondary={<Typography className={classes.chatroomTimestamp} >{`Updated ${this.formatTimestamp(chatroom.timestamp)}`}`</Typography>} />
        </ListItem>);
      }
    );

    return (
      <Drawer
      variant="permanent"
      className={classes.drawer}
      classes={{
        paper: classes.drawerPaper
      }}
      >
        <Toolbar className={classes.toolbar}/>
        <div className={classes.drawerContainer}>
          <div className={classes.messagesContainer}>
            <Typography className={classes.chatHeader} variant="h5">Messages</Typography>
            <IconButton className={classes.newChatroomButton} onClick={this.showMenu} color="primary" component="span">
              <AddCircleOutline />
            </IconButton>
            {this.state.showMenu &&
              <div className={classes.menu} ref={(element) => {this.profileDropdownMenu = element;}}>
                <ul className={classes.menuList}>
                  <li><Button className={classes.menuButton} color="primary" variant="contained" onClick={() => {this.createNewChatroom()}}> New Chat </Button></li>
                  <li><Button className={classes.menuButtonLast} color="primary" variant="contained" onClick={() => {this.createNewClassroom()}}> New Class </Button></li>
                </ul>
              </div>
            }
          </div>
          <List className={classes.rooms}>
            {rooms}
          </List>
        </div>
      </Drawer>
    );
  }
}

export default withStyles(useStyles)(Selector);
