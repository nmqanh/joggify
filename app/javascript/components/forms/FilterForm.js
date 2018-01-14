import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { FormControlLabel } from 'material-ui/Form';
import { Field, reduxForm } from 'redux-form';
import { TextField, Switch } from 'redux-form-material-ui';

const validate = values => {
  const errors = {};

  if (values.fromDate || values.toDate) {
    const requiredFields = ['fromDate', 'toDate'];
    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required';
      }
    });
  }

  if (values.fromDate && values.toDate) {
    const d1 = Date.parse(values.fromDate);
    const d2 = Date.parse(values.toDate);
    if (d1 > d2) {
      errors.toDate = 'To must be later than From';
    }
  }

  if (values.fromDate) {
    const arr = values.fromDate.split('-');
    if (arr.length === 3 && arr[0] > 9999) {
      errors.fromDate = 'Invalid year';
    }
  }

  if (values.toDate) {
    const arr = values.toDate.split('-');
    if (arr.length === 3 && arr[0] > 9999) {
      errors.toDate = 'Invalid year';
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

class FilterForm extends React.Component {
  handleClear() {
    const { reset, onClear } = this.props;
    reset();
    onClear();
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div style={{ ...styles.formContainer }}>
          <Field
            style={{ ...styles.textField }}
            id="fromDate"
            label="From Date"
            name="fromDate"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            component={TextField}
          />
          <Field
            style={{ ...styles.textField }}
            id="toDate"
            label="To Date"
            name="toDate"
            type="date"
            InputLabelProps={{
              shrink: true
            }}
            component={TextField}
          />
          <FormControlLabel
            style={{ height: 30, marginTop: 15 }}
            control={
              <Field name="isDateAscending" component={Switch} />
            }
            label="Date ascending"
          />

          <Button type="submit" raised color="primary" style={{ height: 30, marginTop: 12 }}>
            FILTER
          </Button>
          <Button
            type="button"
            color="default"
            style={{ marginLeft: 10, height: 30, marginTop: 12 }}
            onClick={this.handleClear.bind(this)}
          >
            CLEAR
          </Button>
        </div>
      </form>
    );
  }
}

FilterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'FilterForm',
  validate
})(FilterForm);
