import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class App extends React.Component {
  render() {
    const {
      children
    } = this.props;
    return (
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
        <hr/>
        {children}
        Hello
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
