import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import UserSelect from './UserSelect';

const validate = values => {
  const errors = {};

  const requiredFields = ['fromDate', 'toDate'];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

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
    width: 150
  },
  formContainer: {
    display: 'flex',
    flexWrap: 'wrap'
  }
};

class ReportFilterForm extends React.Component {
  handleReset() {
    const { reset, onReset } = this.props;
    reset();
    onReset();
  }

  onFormChange() {
    const {
      dispatch,
      submit
    } = this.props;
    setTimeout(() => {
      dispatch(submit('ReportFilterForm'));
    }, 100);
  }

  render() {
    const {
      handleSubmit,
      onSelectedUserChange,
      selectedUser,
      isAdmin
    } = this.props;

    return (
      <form
        onSubmit={handleSubmit}
        onChange={this.onFormChange.bind(this)}
      >
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
          {isAdmin &&
            <UserSelect
              selectedUser={selectedUser}
              onChange={onSelectedUserChange}
              style={{ marginTop: 12, width: 200, marginRight: 15 }}
            />
          }
          <Button
            type="button"
            color="default"
            raised
            style={{ marginLeft: 10, height: 30, marginTop: 12 }}
            onClick={this.handleReset.bind(this)}
          >
            RESET
          </Button>
        </div>
      </form>
    );
  }
}

ReportFilterForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  selectedUser: PropTypes.object,
  onSelectedUserChange: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired
};

export default reduxForm({
  form: 'ReportFilterForm',
  validate
})(ReportFilterForm);
