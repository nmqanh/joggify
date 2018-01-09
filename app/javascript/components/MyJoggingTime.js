import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuthenticationActions from '../actions/AuthenticationActions';


class MyJoggingTime extends React.Component {
  render() {
    return (
      <div>
        This is my jogging time {this.props.authentication.currentUser}
      </div>
    );
  }
}

MyJoggingTime.propTypes = {
  authentication: PropTypes.object.isRequired
};

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

export default connect(mapState, mapDispatch)(MyJoggingTime);
