import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

const validate = values => {
  const errors = {};
  const requiredFields = ['email', 'password', 'confirmPassword', 'name'];
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

  if (values.password && values.confirmPassword && values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Confirm password must equal to password';
  }

  return errors;
};

class SignUpForm extends React.Component {
  render() {
    const { handleSubmit } = this.props;
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
          SIGN UP
        </Button>
      </form>
    );
  }
}

SignUpForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'SignUpForm',
  validate
})(SignUpForm);
