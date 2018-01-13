import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import * as AuthActions from '../actions/AuthActions';
import AccountUpdateForm from './forms/AccountUpdateForm';

class AccountSettings extends React.Component {
  handleSignUpSubmit(values) {
    const { authActions: { updateAccount } } = this.props;
    const {
      email,
      newPassword: password,
      name,
      timezone
    } = values;
    updateAccount({
      email, password, name, timezone
    });
  }

  render() {
    const { authentication: { currentUser } } = this.props;

    return (
      <Card style={{ padding: '2em' }}>
        <Typography type="title">
          Account Update
        </Typography>
        <AccountUpdateForm
          initialValues={currentUser}
          currentUser={currentUser}
          onSubmit={this.handleSignUpSubmit.bind(this)}
        />
      </Card>
    );
  }
}

AccountSettings.propTypes = {
  authActions: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    authentication: state.authentication
  };
}

function mapDispatch(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(AccountSettings);
