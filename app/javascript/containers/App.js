import React from 'react';
import PropTypes from 'prop-types';
import Reboot from 'material-ui/Reboot';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';
import ResponsiveDrawer from './ResponsiveDrawer';
import SignInPage from '../components/authentication/SignInPage';
import SignUpPage from '../components/authentication/SignUpPage';
import * as AuthenticationActions from '../actions/AuthenticationActions';

class App extends React.Component {
  render() {
    const {
      children,
      authentication: {
        currentUser
      }
    } = this.props;
    return (
      <div>
        <Reboot />
        {currentUser &&
          <ResponsiveDrawer>
            {children}
          </ResponsiveDrawer>
        }
        {!currentUser &&
          <Switch>
            <Route exact path="/signup" component={SignUpPage}/>
            <Route component={SignInPage}/>
          </Switch>
        }
      </div>
    );
  }
}

function mapState(state) {
  return {
    authentication: state.authentication
  };
}

function mapDispatch(dispatch) {
  return {
    authenticationActions: bindActionCreators(AuthenticationActions, dispatch)
  };
}

App.propTypes = {
  children: PropTypes.array.isRequired,
  authentication: PropTypes.object.isRequired
};

export default connect(mapState, mapDispatch)(App);
