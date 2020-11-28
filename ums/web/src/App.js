import React, { Component } from 'react';
import ChatPage from './components/chat/ChatPage';
import LandingPage from './components/landing/LandingPage';
import DualRing from './components/spinner';
import {
  Route,
  BrowserRouter as Router,
  Switch,
  Redirect
} from 'react-router-dom';
import './App.css';
import { auth } from './firebase/service';
import { ThemeProvider} from '@material-ui/core';
import { uiTheme } from './theme';

// This component allows us to define a 'public route,' which will redirect
// to the login page if the user is not authenticated.
function PrivateRoute({ component: Component, authenticated, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === true
      ? <Component {...props} user={user} />
      : <Redirect to={{ pathname: '/', state: { from: props.location }}}/>}
    />
  );
}

// This component allows us to define a 'public route,' which redirects
// to the chat page if the user is authenticated.
function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authenticated === false
      ? <Component {...props} />
      : <Redirect to='/chat' />}
    />
  );
}

class App extends Component {
  constructor() {
    super();
    // Default state for the app:
    this.state = {
      authenticated: false,
      loading: true,
      user: null,
    };
  }

  render() {
    return this.state.loading === true ? (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <DualRing color={uiTheme.palette.primary.main}/>
      </div>
      ) : (
      <ThemeProvider theme={uiTheme}>
        <Router>
          <Switch>
            <PublicRoute exact path='/' authenticated={this.state.authenticated} component={LandingPage}></PublicRoute>
            <PrivateRoute path='/chat' authenticated={this.state.authenticated} user={this.state.user} component={ChatPage}></PrivateRoute>
            {/* <PrivateRoute path='/profile' authenticated={this.state.authenticated} user={this.state.user} component={ProfilePage}></PrivateRoute> */}
          </Switch>
        </Router>
      </ThemeProvider>
    );
  }

  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
          user: user,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
          user: null,
        });
      }
    });
  }
}

export default App;
