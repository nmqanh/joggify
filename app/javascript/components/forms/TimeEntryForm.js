import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';

const validate = values => {
  const errors = {};
  const requiredFields = ['date', 'distanceInKilometres', 'durationInMinutes'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  if (values.distanceInKilometres && values.distanceInKilometres <= 0) {
    errors.distanceInKilometres = 'Distance must be greater than 0';
  }

  if (values.durationInMinutes && values.durationInMinutes <= 0) {
    errors.durationInMinutes = 'Duration must be greater than 0';
  }

  if (values.durationInMinutes &&
    (parseInt(values.durationInMinutes, 10) - values.durationInMinutes) !== 0) {
    errors.durationInMinutes = 'Duration must be an integer';
  }

  if (values.date) {
    const arr = values.date.split('-');
    if (arr.length === 3 && arr[0] > 9999) {
      errors.date = 'Invalid year';
    }
  }

  return errors;
};

const styles = {
  textField: {
    marginRight: '1em',
    width: 200
  },
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

class TimeEntryForm extends React.Component {
  render() {
    const { handleSubmit, onCancel, isEdit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ ...styles.formContainer }}>
          <Field
            style={{ ...styles.textField, marginTop: '1em' }}
            id="date"
            label="Date"
            name="date"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            component={TextField}
          />
          <Field
            style={{ ...styles.textField }}
            id="distance"
            label="Distance (kms)"
            placeholder="Distance (kms)"
            name="distanceInKilometres"
            margin="normal"
            type="number"
            component={TextField}
          />
          <Field
            style={{ ...styles.textField }}
            id="duration"
            label="Duration (minutes)"
            placeholder="Duration (minutes)"
            name="durationInMinutes"
            margin="normal"
            type="number"
            component={TextField}
          />
        </div>
        <div>
          <Button type="submit" raised color="primary" style={{ marginTop: '1em' }}>
            {isEdit ? 'SAVE' : 'ADD'}
          </Button>
          <Button type="button" raised color="default" style={{ marginTop: '1em', marginLeft: '1em' }} onClick={onCancel}>
            CANCEL
          </Button>
        </div>
      </form>
    );
  }
}

TimeEntryForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEdit: PropTypes.bool
};

export default reduxForm({
  form: 'TimeEntryForm',
  validate
})(TimeEntryForm);
