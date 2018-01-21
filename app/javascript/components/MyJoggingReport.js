import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import Card from 'material-ui/Card';
import { bindActionCreators } from 'redux';
import Typography from 'material-ui/Typography';
import { LineChart } from 'react-chartkick';
import { LinearProgress } from 'material-ui/Progress';
import * as ReportActions from '../actions/ReportActions';
import ReportFilterForm from './forms/ReportFilterForm';

window.Chart = require('chart.js');

class MyJoggingReport extends React.Component {
  constructor() {
    super(...arguments);

    this.state = this.defaultFilterState();
  }

  defaultFilterState() {
    const { currentUser } = this.props;
    return {
      toDate: moment().format('YYYY-MM-DD').toString(),
      fromDate: moment().subtract(6, 'weeks').format('YYYY-MM-DD').toString(),
      selectedUser: this.isAdmin() ? {
        id: currentUser.id,
        label: `${currentUser.name} - ${currentUser.email}`
      } : null
    };
  }

  componentDidMount() {
    this.applyFilter();
  }

  isAdmin() {
    const { currentUser: { role } } = this.props;
    return role === 'admin';
  }

  applyFilter() {
    const {
      reportActions
    } = this.props;

    const {
      fromDate,
      toDate,
      selectedUser
    } = this.state;

    reportActions.getTimeEntriesByWeeksReport({
      fromDate,
      toDate,
      userId: selectedUser ? selectedUser.id : null
    });
  }

  handleSubmitFilter({ fromDate, toDate }) {
    if (fromDate === this.state.fromDate &&
      toDate === this.state.toDate) {
      return;
    }
    this.setState({
      toDate,
      fromDate
    }, this.applyFilter);
  }

  handleResetFilter() {
    this.setState(this.defaultFilterState(), this.applyFilter);
  }

  handleSelectedUserChange(selectedUser) {
    this.setState({
      selectedUser
    }, this.applyFilter);
  }

  render() {
    const {
      report: {
        reportItems,
        isLoading
      }
    } = this.props;

    const { fromDate, toDate, selectedUser } = this.state;

    const distanceData = reportItems.reduce((data, item) => {
      const nextData = data;
      nextData[item.week] = item.distanceInKilometres.toFixed(2);
      return nextData;
    }, {});

    const avgSpeedData = reportItems.reduce((data, item) => {
      const nextData = data;
      nextData[item.week] = item.averageSpeedInKmph.toFixed(2);
      return nextData;
    }, {});

    return (
      <div>
        <Card style={{ marginBottom: '1em', padding: '1em' }}>
          <ReportFilterForm
            initialValues={{
              fromDate,
              toDate,
              selectedUser
            }}
            isAdmin={this.isAdmin()}
            selectedUser={selectedUser}
            onSelectedUserChange={this.handleSelectedUserChange.bind(this)}
            onSubmit={this.handleSubmitFilter.bind(this)}
            onReset={this.handleResetFilter.bind(this)}
          />
        </Card>
        {!isLoading &&
          <div>
            <Card style={{ padding: '1em' }}>
              <Typography type="title" style={{ paddingBottom: 30 }}>
                Jogging distance through weeks
              </Typography>
              <LineChart label="Distance" height="200px" data={distanceData} xtitle="Weeks" ytitle="km" />
            </Card>
            <Card style={{ padding: '1em', marginTop: '2em' }}>
              <Typography type="title" style={{ paddingBottom: 30 }}>
                Average speed through weeks
              </Typography>
              <LineChart label="Average speed" height="200px" data={avgSpeedData} xtitle="Weeks" ytitle="km/h" />
            </Card>
          </div>
        }
        {isLoading &&
          <LinearProgress style={{ marginTop: 10 }}/>
        }
      </div>
    );
  }
}

MyJoggingReport.propTypes = {
  report: PropTypes.object.isRequired,
  reportActions: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    report: state.report,
    currentUser: state.authentication.currentUser
  };
}

function mapDispatch(dispatch) {
  return {
    reportActions: bindActionCreators(ReportActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(MyJoggingReport);
