import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import { Field, reduxForm } from 'redux-form';
import { InputLabel } from 'material-ui/Input';
import { TextField, Select } from 'redux-form-material-ui';
import timezones from '../../consts/timezones';
import TimezoneSelect from './TimezoneSelect';


const validate = (values, props) => {
  const errors = {};
  const requiredFields = ['email', 'name', 'timezone', 'role'];

  if (!props.editingUser) {
    requiredFields.push('password', 'confirmPassword');
  }

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.password && values.password.length < 8) {
    errors.password = 'Password must have at least 8 characters';
  }

  if (values.password && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Confirm password must equal to password';
  }

  if (values.timezone && timezones.indexOf(values.timezone) < 0) {
    errors.timezone = 'You must choose one of the valid timezone from the given list';
  }

  return errors;
};

class EditUserForm extends React.Component {
  render() {
    const {
      handleSubmit,
      editingUser,
      blur,
      actionName,
      onCancel,
      currentRole
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <InputLabel>Choose a Role</InputLabel>
          <Field
            id="role"
            name="role" fullWidth component={Select}
          >
            {currentRole === 'admin' && <MenuItem value="admin">Admin</MenuItem>}
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Field>
        </div>
        <Field
          label="Full Name"
          type="text"
          placeholder="Full Name"
          margin="normal"
          fullWidth
          name="name"
          component={TextField}
        />

        <TimezoneSelect blur={blur} timezone={editingUser ? editingUser.timezone : ''} />

        <Field
          label="Email Address"
          type="email"
          placeholder="Email Address"
          margin="normal"
          fullWidth
          name="email"
          component={TextField}
        />
        <Field
          label="Password"
          type="password"
          placeholder="Password"
          margin="normal"
          fullWidth
          name="password"
          component={TextField}
        />
        <Field
          label="Confirm password"
          type="password"
          placeholder="Confirm Password"
          margin="normal"
          fullWidth
          name="confirmPassword"
          component={TextField}
        />

        <Button type="submit" raised color="primary" style={{ marginTop: '3em' }}>
          {actionName || 'UPDATE'}
        </Button>
        <Button type="submit" onClick={onCancel} raised color="default" style={{ marginTop: '3em', marginLeft: '1em' }}>
          CANCEL
        </Button>
      </form>
    );
  }
}

EditUserForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  editingUser: PropTypes.object,
  blur: PropTypes.func.isRequired,
  actionName: PropTypes.string,
  currentRole: PropTypes.string.isRequired
};

export default reduxForm({
  form: 'EditUserForm',
  validate
})(EditUserForm);
