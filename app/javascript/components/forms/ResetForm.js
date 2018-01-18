import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

const validate = values => {
  const errors = {};
  const requiredFields = ['password', 'confirmPassword'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  if (values.password && values.password.length < 8) {
    errors.password = 'Password must have at least 8 characters';
  }

  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Confirm password must equal to password';
  }

  return errors;
};

class ResetForm extends React.Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          label="New Password"
          type="password"
          placeholder="New Password"
          margin="normal"
          fullWidth
          name="password"
          component={TextField}
        />
        <Field
          label="Confirm new password"
          type="password"
          placeholder="Confirm new Password"
          margin="normal"
          fullWidth
          name="confirmPassword"
          component={TextField}
        />
        <Button type="submit" raised color="primary" style={{ marginTop: '3em' }}>
          UPDATE NEW PASSWORD
        </Button>
      </form>
    );
  }
}

ResetForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'ResetForm',
  validate
})(ResetForm);
