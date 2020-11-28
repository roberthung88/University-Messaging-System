import React, { Component } from 'react';
import {
  Typography,
  Button,
  TextField,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
// import Member from './Member';
import { getMembersListHandler, onInviteUserSubmit } from '../../firebase/chatrooms';

const useStyles = theme => ({
  container: {
    // display: 'flex',
    // flexDirection: 'row',
    marginTop: '0.5rem',
    color: '#757575',
  },
  membersHeader: {
    marginLeft: '1rem',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
    color: '#757575',
    lineHeight: '24px',
    fontSize: '14px',
    width: '75%',
    display: 'inline'
  },
  newMemberSend: {
    marginRight: '1rem',
    marginBottom: '0.25rem',
    marginTop: '8px',
    height: 40,
  },
  textEditor: {
    flexGrow: 1,
    marginRight: '0.5rem',
  },
  textWrap: {
    marginLeft: '0.5rem',
  },
  imageWrap: {
    marginLeft: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
});

// MemberView is used to allow administrators to add new members to a chat/class.
//
// Expected props:
//   - type: a string with a value of either "Class" or "Chat" to describe the context MemberView is being displayed in.
//   - chatroomId: the current chatroom/classroom ID that this MemberView is being displayed in. Needed to add members to the room.
//   - userIsAdmin: true/false. Determines whether or not we display options to the user to add members. Even if these are incorrectly
//                  displayed to basic users, Firebase will not let non-administrators add members so no vulnerabilities exist with this
//                  being on the client-side.
class MemberView extends Component {
  constructor(props) {
    super(props);

    this.addMemberTextInput = React.createRef();

    this.state = {
      memberIndices: {},
      members: [],
      membersTypography: "",
      membersListener: null,
      userIsAdmin: this.props.userIsAdmin,
      showForm: false,
      newMember: "",
    }

    this.handleMembers = this.handleMembers.bind(this);
    this.showForm = this.showForm.bind(this);
    this.addNewMember = this.addNewMember.bind(this);
    this.updateMember = this.updateMember.bind(this);
  }

  handleMembers(doc) {
    // console.log('called ' + this.props.chatroomId);
    if(this.memberViewRef && this.state.members !== doc.data.members) {
      this.setState({
        members: doc.data().membersArr,
        membersTypography: `${this.props.type} Members (${doc.data().membersArr.length})`,
      });
    }

    
    // snapshot.docChanges().forEach(change => {
    //   let indices = this.state.memberIndices;
    //   let members = this.state.members;

    //   // TODO: Unfortunately, we only save the UID, not the user's info.
    //   // The membersArr contains this info. We should check if our current member's list is equal to the one found in the database.
    //   // We should have a new "temporary" or "remote" membersArr stored in the state that we can check against.
    //   // Once we update this, we should then call another method to actually handle any changes, which will look like the code below.
    //   // This will actually update our members array for the state and will then handle the subsequent request to the database to grab the user's details based on the given uuid.
    //   // Probably not smart to update in onSnapshot? Seems pretty inefficient since we have to copy the array each and every time.

    //   //if(members !== change.data().)

    //   if(change.type === "removed") {
    //     const removeIndex = indices[change.doc.id];
    //     members.splice(removeIndex, removeIndex + 1);
    //     delete indices[change.doc.id];
    //   } else if(change.type === "added") {
    //     // Add the document ID to the document's data before pushing to the list of members.
    //     const data = Object.assign(change.doc.data(), { uid: change.doc.id });
    //     indices[change.doc.id] = members.push(data) - 1;
    //   } else {
    //     const data = Object.assign(change.doc.data(), { uid: change.doc.id });
    //     const index = indices[change.doc.id];
    //     members[index] = data;
    //   }
    //   this.setState({
    //     memberIndices: indices,
    //     members: members,
    //   });
    //   console.log(members);
    // });
  }

  componentDidMount() {
    this.memberViewRef = React.createRef();

    if (this.props.chatroomId) {
      this.setState({
        membersListener: getMembersListHandler(this.props.chatroomId, this.handleMembers),
      });
    }
  }

  componentWillUnmount() {
    this.memberViewRef = null;
    if(this.state.membersListener) {
      this.state.membersListener();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chatroomId !== this.props.chatroomId) {
      // If we have a new chatroom ID, we need to load in a new set of messages.
      // That means we may need to deregister our previous listener and make a
      // new one.
      if (this.state.membersListener) {
        // Deregister old listener
        this.state.membersListener();
      }
      this.setState({
        memberIndices: {},
        members: [],
        membersListener: getMembersListHandler(this.props.chatroomId, this.handleMembers),
      });
    }
  }

  showForm() {
    this.setState({
      showForm: !this.state.showForm,
    })
  }
  
  addNewMember(event) {
    event.preventDefault();
    onInviteUserSubmit(this.props.chatroomId, this.state.newMember);
    this.setState({ newMember: "" });
  }

  updateMember(event) {
    event.preventDefault();
    this.setState({ newMember: event.target.value });
  }

  render() {
    const classes = this.props.classes;

    let content;

    // const chatMembers = this.state.members.map(member => (
    //   <Member key={member.uid} member={member} />
    // ));

    content = (
      <div ref={this.memberViewRef} className={classes.container}>
        <div>
          <Typography className={classes.membersHeader} variant="h5">{this.state.membersTypography}</Typography>
          {this.state.userIsAdmin &&
            <IconButton className={classes.newChatroomButton} onClick={this.showForm} color="primary" component="span">
              <AddCircleOutline />
            </IconButton>
          }
          {this.state.showForm &&
            <form onSubmit={this.addNewMember}>
              <TextField
                id="add-member-editor"
                inputRef={this.addMemberTextInput}
                className={classes.textEditor}
                label="User Email..."
                margin="dense"
                variant="outlined"
                value={this.state.newMember}
                onChange={this.updateMember}
              />
              <Button onClick={this.addNewMember} color="primary" className={classes.newMemberSend} variant="contained">Invite</Button>
            </form>
          }
        </div>
        {/* <div style={{clear: 'both',}}>
          {chatMembers}
        </div> */}
        {/* <Avatar src={msg.profilePicUrl} alt={msg.name}/>
        <div className={classes.textWrap}>
            <Typography variant="caption">{msg.name}</Typography>
            <Typography>{msg.text}</Typography>
        </div> */}
      </div>
    );

    return content;
  }
}

export default withStyles(useStyles)(MemberView);
