import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Async } from 'react-select';
import { bindActionCreators } from 'redux';
import * as UserActions from '../../actions/UserActions';

class UserSelect extends React.Component {
  constructor() {
    super(...arguments);

    this.getOptions = this.getOptions.bind(this);
  }
  getOptions(query) {
    const { userActions } = this.props;
    return userActions.searchUsers(query)
      .then(({ data: users }) => ({ options: users }));
  }

  render() {
    const {
      style,
      onChange,
      selectedUser,
      clearable
    } = this.props;
    return (
      <Async
        style={style}
        name="userSelect"
        autosize={false}
        valueKey="id"
        value={selectedUser}
        clearable={clearable || false}
        labelKey="label"
        onChange={onChange}
        loadOptions={this.getOptions}
      />
    );
  }
}

UserSelect.propTypes = {
  userActions: PropTypes.object.isRequired,
  style: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  clearable: PropTypes.bool
};

function mapState() {
  return {};
}

function mapDispatch(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(UserSelect);
