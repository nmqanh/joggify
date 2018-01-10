import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as AuthenticationActions from '../actions/AuthenticationActions';


class MyJoggingReport extends React.Component {
  render() {
    return (
      <div>
        This is my jogging report
      </div>
    );
  }
}

MyJoggingReport.propTypes = {
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

export default connect(mapState, mapDispatch)(MyJoggingReport);
