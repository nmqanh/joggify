import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import timezones from '../../consts/timezones';
import TimezoneSelect from './TimezoneSelect';


const validate = values => {
  const errors = {};
  const requiredFields = ['email', 'name', 'timezone'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (values.newPassword && values.newPassword.length < 8) {
    errors.newPassword = 'Password must have at least 8 characters';
  }

  if (values.newPassword && values.newPassword !== values.confirmNewPassword) {
    errors.confirmNewPassword = 'Confirm password must equal to password';
  }

  if (values.timezone && timezones.indexOf(values.timezone) < 0) {
    errors.timezone = 'You must choose one of the valid timezone from the given list';
  }

  return errors;
};

class AccountUpdateForm extends React.Component {
  render() {
    const { handleSubmit, currentUser: { timezone }, blur } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          label="Full Name"
          type="text"
          placeholder="Full Name"
          margin="normal"
          fullWidth
          name="name"
          component={TextField}
        />

        <TimezoneSelect blur={blur} timezone={timezone} />

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
          label="New password"
          type="password"
          placeholder="New password"
          margin="normal"
          fullWidth
          name="newPassword"
          component={TextField}
        />
        <Field
          label="Confirm new password"
          type="password"
          placeholder="Confirm new Password"
          margin="normal"
          fullWidth
          name="confirmNewPassword"
          component={TextField}
        />

        <Button type="submit" raised color="primary" style={{ marginTop: '3em' }}>
          UPDATE
        </Button>
      </form>
    );
  }
}

AccountUpdateForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  blur: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'AccountUpdateForm',
  validate
})(AccountUpdateForm);
