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
    this.state = {
      toDate: moment().format('YYYY-MM-DD').toString(),
      fromDate: moment().subtract(2, 'months').format('YYYY-MM-DD').toString()
    };
  }

  componentDidMount() {
    this.applyFilter();
  }

  applyFilter() {
    const {
      reportActions
    } = this.props;

    const {
      fromDate,
      toDate
    } = this.state;

    reportActions.getTimeEntriesByWeeksReport({
      fromDate,
      toDate
    });
  }

  handleSubmitFilter({ fromDate, toDate }) {
    this.setState({
      toDate,
      fromDate
    }, this.applyFilter);
  }

  handleClearFilter() {
    this.setState({
      toDate: moment().format('YYYY-MM-DD').toString(),
      fromDate: moment().subtract(3, 'months').format('YYYY-MM-DD').toString()
    }, this.applyFilter);
  }

  render() {
    const {
      report: {
        reportItems,
        isLoading
      }
    } = this.props;

    const { fromDate, toDate } = this.state;

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
              toDate
            }}
            onSubmit={this.handleSubmitFilter.bind(this)}
            onClear={this.handleClearFilter.bind(this)}
          />
        </Card>
        {!isLoading &&
          <div>
            <Card style={{ padding: '1em' }}>
              <Typography type="title" style={{ paddingBottom: 30 }}>
                Jogging distance through weeks
              </Typography>
              <LineChart height="200px" data={distanceData} xtitle="Weeks" ytitle="km" />
            </Card>
            <Card style={{ padding: '1em', marginTop: '2em' }}>
              <Typography type="title" style={{ paddingBottom: 30 }}>
                Average speed through weeks
              </Typography>
              <LineChart height="200px" data={avgSpeedData} xtitle="Weeks" ytitle="km/h" />
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
  reportActions: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    report: state.report
  };
}

function mapDispatch(dispatch) {
  return {
    reportActions: bindActionCreators(ReportActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(MyJoggingReport);
