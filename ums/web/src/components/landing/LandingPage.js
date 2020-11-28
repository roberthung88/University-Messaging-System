import React, { Component } from 'react';
import LoginButton from './LoginButton';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';

const useStyles = theme => ({
  '@keyframes bg': {
    from: {
      transform: 'scaleY(0) scaleX(1.2) skewY(0deg)',
      opacity: 1,
    },
    to: {
      transform: 'scaleY(1) scaleX(1) skewY(0)',
      opacity: 1,
    }
  },
  container: {
    height: '100vh',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderDiv: {
    width: '95%',
    maxWidth: '525px',
    margin: 'auto',
    textAlign: 'center',
    background: 'rgba(153, 0, 0, 0.25)',
    animation: '$bg .6s cubic-bezier(0.215, 0.61, 0.355, 1) forwards',
  },
  innerPadding: {
    padding: '40px',
  },
  umsLogo: {
    width: '100%',
    maxWidth: '445px',
    paddingBottom: '40px',
  },
});

class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = { src: null };

    this.preventDragHandler = this.preventDragHandler.bind(this);
  }

  componentDidMount() {
    const src = "/backgroundImage3.jpg";

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      this.setState({ src });
    };
  }

  preventDragHandler = (e) => {
    e.preventDefault();
  }

  render() {
    const classes = this.props.classes;

    return (
      <Fade in={this.state.src !== null} timeout={250}>
        <div className={classes.container} style={this.state.src ? {backgroundImage: `url(${this.state.src})`} : {display: 'none'}}>
          <div className={classes.borderDiv}>
            <div className={classes.innerPadding}>
              <img src='/ums_logo3.png' onDragStart={this.preventDragHandler} className={classes.umsLogo} alt="University Messaging System" />
              <LoginButton setLoginError={(message) => {console.log(message)}}></LoginButton>
            </div>
          </div>
        </div>
      </Fade>
    );
  }
}

export default withStyles(useStyles)(LandingPage);