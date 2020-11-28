import React, { Component } from 'react';
import { login } from '../../firebase/auth';
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const LoginStyledButton = withStyles({
  root: {
    background: "'primary'",
    borderRadius: 3,
    border: 0,
    color: 'white',
    minHeight: 48,
    height: 'auto',
    padding: '0 30px',
    width: 'auto',
    maxWidth: '200px',
  },
  label: {
    textTransform: 'none',
    fontWeight: 'bold',
  },
})(Button);

// This class creates a Login button and handles the firebase auth triggering.
// It expects to be passed a setLoginError function so that its parent component
// can trigger an error message if login fails.
class LoginButton extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  async handleLogin() {
    this.setState({ error: '' });
    try {
      await login();
    } catch (error) {
      this.props.setLoginError(error.message);
    }
  }

  render() {
    return (
      <LoginStyledButton variant="contained" color="primary" onClick={this.handleLogin}>Sign in with Google</LoginStyledButton>
    );
  }
}

export default LoginButton;
