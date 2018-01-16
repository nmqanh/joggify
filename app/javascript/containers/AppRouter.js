import React from 'react';
import PropTypes from 'prop-types';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import MyJoggingTime from '../components/MyJoggingTime';
import MyJoggingReport from '../components/MyJoggingReport';
import AccountSettings from '../components/AccountSettings';
import UserManagement from '../components/UserManagement';

class AppRouter extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Router>
          <App>
            <Route exact path="/" component={MyJoggingTime}/>
            <Route exact path="/report" component={MyJoggingReport}/>
            <Route exact path="/account-settings" component={AccountSettings}/>
            <Route exact path="/users" component={UserManagement}/>
          </App>
        </Router>
      </Provider>
    );
  }
}

AppRouter.propTypes = {
  store: PropTypes.object.isRequired
};

export default AppRouter;
