import React from 'react';
import PropTypes from 'prop-types';
import Reboot from 'material-ui/Reboot';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import ResponsiveDrawer from './ResponsiveDrawer';
import SignInPage from '../components/authentication/SignInPage';
import SignUpPage from '../components/authentication/SignUpPage';
import ResetPage from '../components/authentication/ResetPage';
import ForgotPage from '../components/authentication/ForgotPage';
import * as AuthActions from '../actions/AuthActions';
import * as ToastActions from '../actions/ToastActions';
import Toaster from '../components/common/Toaster';

class App extends React.Component {
  toasted() {
    const { toastActions } = this.props;
    toastActions.clearToaster();
  }

  getChildContext() {
    return {
      toastActions: this.props.toastActions
    };
  }

  componentDidMount() {
    const {
      authActions: {
        validateToken
      },
      authentication: {
        currentUser
      }
    } = this.props;
    currentUser && validateToken();
  }

  render() {
    const {
      children,
      authentication: {
        currentUser
      },
      toast: {
        dash
      },
      authActions
    } = this.props;

    return (
      <div>
        <Toaster
          {...dash}
          duration={4000}
          onClose={this.toasted.bind(this)}
        />
        <Reboot />
        {currentUser &&
          <ResponsiveDrawer authActions={authActions} currentUser={currentUser}>
            {children}
          </ResponsiveDrawer>
        }
        {!currentUser &&
          <Switch>
            <Route
              exact path="/signup"
              render={(routeProps) => (
                <SignUpPage {...routeProps} authActions={authActions} />
              )}
            />
            <Route
              exact path="/reset"
              render={(routeProps) => (
                <ResetPage {...routeProps} authActions={authActions} />
              )}
            />
            <Route
              exact path="/forgot"
              render={(routeProps) => (
                <ForgotPage {...routeProps} authActions={authActions} />
              )}
            />
            <Route
              render={(routeProps) => (
                <SignInPage {...routeProps} authActions={authActions} />
              )}
            />
          </Switch>
        }
      </div>
    );
  }
}

function mapState(state) {
  return {
    authentication: state.authentication,
    toast: state.toast
  };
}

function mapDispatch(dispatch) {
  return {
    toastActions: bindActionCreators(ToastActions, dispatch),
    authActions: bindActionCreators(AuthActions, dispatch)
  };
}

App.childContextTypes = {
  toastActions: PropTypes.object.isRequired
};

App.propTypes = {
  children: PropTypes.array.isRequired,
  authentication: PropTypes.object.isRequired,
  toast: PropTypes.object.isRequired,
  toastActions: PropTypes.object.isRequired,
  authActions: PropTypes.object.isRequired
};

export default withRouter(connect(mapState, mapDispatch)(App));
