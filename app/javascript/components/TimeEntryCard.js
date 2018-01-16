import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import pluralize from 'pluralize';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import RunIcon from 'material-ui-icons/DirectionsRun';
import TimeIcon from 'material-ui-icons/Timer';
import PersonIcon from 'material-ui-icons/Person';
import SpeedIcon from 'material-ui-icons/NetworkCheck';
import TimeEntryForm from './forms/TimeEntryForm';
import ConfirmDialog from './shared/ConfirmDialog';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: '0 2px 10px 2px'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    marginBottom: 10,
    fontSize: 16,
    color: theme.palette.text.primary
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary
  }
});

class TimeEntryCard extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      isShowingTimeEntryForm: false,
      isShowingConfirmRemoveDialog: false
    };
  }

  showTimeEntryForm() {
    this.setState({
      isShowingTimeEntryForm: true
    });
  }

  hideTimeEntryForm() {
    this.setState({
      isShowingTimeEntryForm: false
    });
  }

  showConfirmRemoveDialog() {
    this.setState({
      isShowingConfirmRemoveDialog: true
    });
  }

  hideConfirmRemoveDialog() {
    this.setState({
      isShowingConfirmRemoveDialog: false
    });
  }

  handleSubmitNextTimeEntry(values) {
    const { handleEditTimeEntry } = this.props;
    handleEditTimeEntry(values);
    this.hideTimeEntryForm();
  }

  handleConfirmRemoveTimeEntry() {
    const { removeTimeEntry, timeEntry: { id } } = this.props;
    removeTimeEntry(id);
    this.hideTimeEntryForm();
  }

  averageSpeedInKmsPerHour() {
    const { timeEntry: { distanceInKilometres, durationInMinutes } } = this.props;
    return ((distanceInKilometres * 60) / durationInMinutes).toFixed(2);
  }

  currentDate(format = null) {
    return moment(this.props.timeEntry.date).format(format || 'DD/MM/YYYY').toString();
  }

  distance() {
    const { timeEntry: { distanceInKilometres } } = this.props;
    return `${distanceInKilometres.toFixed(2)} km`;
  }

  duration() {
    const { timeEntry: { durationInMinutes } } = this.props;
    return pluralize('minute', durationInMinutes, true);
  }

  render() {
    const { classes, isAdmin } = this.props;
    const { isShowingTimeEntryForm, isShowingConfirmRemoveDialog } = this.state;
    const { timeEntry: { createdByName } } = this.props;
    return (
      <Card className={classes.card}>
        {isShowingConfirmRemoveDialog &&
          <ConfirmDialog
            confirmTitle="Do you want to remove this jogging time?"
            confirmText={`Jog ${this.distance()} km in ${this.duration()} on ${this.currentDate()}`}
            onCancel={this.hideConfirmRemoveDialog.bind(this)}
            onConfirm={this.handleConfirmRemoveTimeEntry.bind(this)}
          />
        }
        <CardContent style={{ paddingBottom: isShowingTimeEntryForm ? 20 : 0 }}>
          <Typography type="title" className={classes.title}>{ this.currentDate() }</Typography>
          <Typography style={{ display: 'flex', alignItems: 'center' }}>
            <RunIcon color="primary" style={{ marginRight: 5 }}/>Jog&nbsp;<strong>{this.distance()}</strong>
            &nbsp;in <TimeIcon color="primary" style={{ margin: '0 5px 0 10px' }} />
            <strong>{this.duration()}</strong>
            <span style={{ margin: '0 5px' }}>with average speed</span><SpeedIcon color="primary" style={{ margin: '0 10px 0 5px' }}/>
            <strong>{this.averageSpeedInKmsPerHour()} km/h</strong>
          </Typography>
          {isAdmin &&
            <Typography style={{ display: 'flex', alignItems: 'flex-end' }}>
              <PersonIcon color="primary" style={{ marginRight: 5 }}/> <span>{createdByName}</span>
            </Typography>
          }
          {isShowingTimeEntryForm &&
            <TimeEntryForm
              initialValues={{
                ...this.props.timeEntry,
                date: this.currentDate('YYYY-MM-DD')
              }}
              isEdit={true}
              onSubmit={this.handleSubmitNextTimeEntry.bind(this)}
              onCancel={this.hideTimeEntryForm.bind(this)}
            />
          }
        </CardContent>
        {!isShowingTimeEntryForm &&
          <CardActions>
            <Button dense onClick={this.showTimeEntryForm.bind(this)}>Edit</Button>
            <Button dense onClick={this.showConfirmRemoveDialog.bind(this)}>Remove</Button>
          </CardActions>
        }
      </Card>
    );
  }
}

TimeEntryCard.propTypes = {
  classes: PropTypes.object.isRequired,
  timeEntry: PropTypes.object.isRequired,
  handleEditTimeEntry: PropTypes.func.isRequired,
  removeTimeEntry: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

export default withStyles(styles)(TimeEntryCard);
