import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class UserManagement extends React.Component {
  canManageUsers() {
    const { authentication: { currentUser: { role } } } = this.props;
    return role === 'admin' || role === 'manager';
  }
  render() {
    if (!this.canManageUsers()) {
      return <div/>;
    }

    return (
      <div>User Management</div>
    );
  }
}

UserManagement.propTypes = {
  authentication: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    authentication: state.authentication
  };
}

function mapDispatch() {
  return {
  };
}

export default connect(mapState, mapDispatch)(UserManagement);
