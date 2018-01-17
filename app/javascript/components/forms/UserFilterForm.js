import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';

class UserFilterForm extends React.Component {
  handleChange(e) {
    const { onChange } = this.props;

    onChange({ [e.target.name]: e.target.value });
  }

  render() {
    const { query, role, onReset } = this.props;
    return (
      <div>
        <Select
          value={role}
          onChange={this.handleChange.bind(this)}
          input={<Input name="role" id="role-simple" />}
          style={{ marginRight: 10, height: 31 }}
        >
          <MenuItem value="all">
            <em>View All Roles</em>
          </MenuItem>
          <MenuItem value="admin">Admin Role</MenuItem>
          <MenuItem value="manager">Manager Role</MenuItem>
          <MenuItem value="user">User Role</MenuItem>
        </Select>
        <TextField
          style={{ width: 300, marginRight: 10 }}
          id="searchUser"
          name="query"
          type="text"
          value={query}
          placeholder="Search User"
          onChange={this.handleChange.bind(this)}
        />
        <Button
          type="button"
          color="default"
          raised
          onClick={onReset}
        >
          RESET
        </Button>
      </div>
    );
  }
}

UserFilterForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  query: PropTypes.string,
  role: PropTypes.string
};

export default UserFilterForm;
