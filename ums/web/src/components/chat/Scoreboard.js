import React, { Component } from 'react';
import {
  Button,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import {HOST} from '../game-logic/BackendServerLocation';

const useStyles = theme => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
  },
  memberContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  scoreboardTitle: {
    fontSize: '2rem',
    lineHeight: '36px',
    color: '#757575',
    fontWeight: 'bold',
  },
  scoreboardMember: {
    minWidth: 0,
    paddingLeft: '5px',
    paddingRight: 0,
  },
  lockedMember: {
    minWidth: 0,
    paddingLeft: 0,
    paddingRight: 0,
    background: "#FFCC00",
  },
  table: {
    minWidth: 0,
    width: 'auto',
  },
});

class Scoreboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // We rely on the fact that modern Javascript implementations all
      // preserve a deterministic ordering for Objects. In the future,
      // if we want to order on more explicit parameters, this implementation
      // may need to change into something closer to the state management
      // solution used in ChatView.
      members: [],
      lockedMember: null,
      isLoaded: false,
      scoreboardDisplaying: true,
      error: null,
      interval: null,
    };
    this.fetchScoreboardUpdate = this.fetchScoreboardUpdate.bind(this);
    this.lockTopMember = this.lockTopMember.bind(this);
    this.removeLockedMember = this.removeLockedMember.bind(this);
  }

  componentDidMount() {
    // Set the state of the component in such a way that we will keep fetching scoreboard updates.
    this.setState({
      scoreboardDisplaying: true,
    });
    this.setState({
      interval: setInterval(() => {
        this.fetchScoreboardUpdate();
      }, 5000),
    })
    this.fetchScoreboardUpdate();
  }

  // Stops the component from repeatedly fetching updates since the scoreboard is no longer displaying.
  componentWillUnmount() {
    this.setState({
      scoreboardDisplaying: false,
    });
    clearInterval(this.state.interval);
  }

  fetchScoreboardUpdate() {
    if(this.state.scoreboardDisplaying) {
      // Fetch the data.
      fetch(`${HOST}/scoreboard`)
        .then(res => res.json())
        .then(
          (result) => {
            this.setState({
              isLoaded: true,
              members: result.users,
            });
          },
          (error) => {
            this.setState({
              isLoaded: true,
              members: null,
              error
            });
          }
        );
    }
  }

  lockTopMember() {
    if(this.state.members && this.state.members.length > 0) {
      let memberToLock = this.state.members[0];

      this.setState({
        lockedMember: memberToLock,
        members: this.state.members.slice(1),
      });

      fetch(`${HOST}/scoreboard/user/${memberToLock.email}`, {method: 'DELETE'});
    }
  }

  removeLockedMember() {
    this.setState({
      lockedMember: null,
    });
  }

  render() {
    const classes = this.props.classes;

    let content;

    let lockedMember = null;
    if(this.state.lockedMember) {
      lockedMember = (
        <TableRow key={this.state.lockedMember.score + this.state.lockedMember.email}>
          <TableCell size="small" align="left" className={classes.lockedMember}>{this.state.lockedMember.score}</TableCell>
          <TableCell size="small" align="left" className={classes.lockedMember}>{this.state.lockedMember.email}</TableCell>
        </TableRow>
      );
    }

    let scoreboardMembers = null;
    if(this.state.members) {
      scoreboardMembers = this.state.members.map(member => (
        <TableRow key={member.score + member.email}>
          <TableCell size="small" align="left" className={classes.scoreboardMember}>{member.score}</TableCell>
          <TableCell size="small" align="left" className={classes.scoreboardMember}>{member.email}</TableCell>
        </TableRow>
        // <div className={classes.memberContainer}>
        //   <Typography variant="h6" className={classes.scoreboardMember}>{member.score}</Typography>
        //   <Typography variant="h6" className={classes.scoreboardMember}>{member.name}</Typography>
        // </div>
      ));
    }
    
    content = (
      <div className={classes.container}>
        <Typography variant="h6" className={classes.scoreboardTitle}>Scoreboard</Typography>
        {this.props.userIsAdmin && !this.state.lockedMember && this.state.members && this.state.members.length > 0 && <Button style={{maxWidth: '213px',}} variant="contained" color="primary" onClick={() => this.lockTopMember()}>Lock Top Member</Button>}
        {this.props.userIsAdmin && this.state.lockedMember && <Button style={{maxWidth: '213px',}} variant="contained" color="primary" onClick={() => this.removeLockedMember()}>Remove Locked Member</Button>}
        <Table className={classes.table} size="small" aria-label="scoreboard">
          <TableBody>
            {!this.state.lockedMember && (!this.state.members || !this.state.members.length > 0) && (
              <TableRow key="nousers">
                <TableCell size="small" align="left" className={classes.scoreboardMember}>No students in queue.</TableCell>
              </TableRow>
            )}
            {lockedMember}
            {scoreboardMembers}
          </TableBody>
        </Table>
      </div>
    );

    return content;
  }
}

export default withStyles(useStyles)(Scoreboard);
