import React, { Component } from 'react';
import {
  Avatar,
  Typography,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.5rem',
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

class Member extends Component {
  render() {
    const classes = this.props.classes;
    const member = this.props.member;
    console.log(member);
    
    return (
      <div className={classes.container}>
        <Avatar src={member.profilePicUrl} alt={member.name}/>
        <div className={classes.textWrap}>
          <Typography variant="caption">{member.name}</Typography>
          <Typography>{member.text}</Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(Member);
