import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

const validate = values => {
  const errors = {};
  const requiredFields = ['email', 'password'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  return errors;
};

class SignInForm extends React.Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
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

        <Button type="submit" raised color="primary" style={{ marginTop: '3em' }}>
          SIGN IN
        </Button>
      </form>
    );
  }
}

SignInForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'SignInForm',
  validate
})(SignInForm);
