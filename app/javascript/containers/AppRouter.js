import React from 'react';
import PropTypes from 'prop-types';

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { Provider } from 'react-redux';

import App from './App';
import MyJoggingTime from '../components/MyJoggingTime';


const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

class AppRouter extends React.Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <Router>
          <App>
            <Route exact path="/" component={MyJoggingTime}/>
            <Route path="/about" component={About}/>
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
