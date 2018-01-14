import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Infinite from 'react-infinite';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import TimeEntryForm from './forms/TimeEntryForm';
import FilterForm from './forms/FilterForm';
import * as TimeEntryActions from '../actions/TimeEntryActions';
import TimeEntryCard from './TimeEntryCard';


const styles = {
  container: {
    padding: '1em'
  },
  filterCard: {
    margin: '1em 0 10px 0'
  }
};

class MyJoggingTime extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      isShowingTimeEntryForm: false,
      fromDate: null,
      toDate: null,
      isDateAscending: false
    };
  }

  componentWillMount() {
    const {
      timeEntryActions
    } = this.props;
    timeEntryActions.resetTimeEntries();
    timeEntryActions.getTimeEntries({ page: 1 });
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

  handleSubmitNewTimeEntry(values) {
    const {
      timeEntryActions
    } = this.props;
    timeEntryActions.addTimeEntry(values);
    this.hideTimeEntryForm();
  }

  handleSubmitFilter({ fromDate, toDate, isDateAscending = false }) {
    const {
      timeEntryActions: {
        getTimeEntries,
        resetTimeEntries
      }
    } = this.props;
    this.setState({
      fromDate,
      toDate,
      isDateAscending
    }, () => {
      resetTimeEntries();
      getTimeEntries({
        page: 1,
        fromDate,
        toDate,
        isDateAscending
      });
    });
  }

  handleClearFilter() {
    const {
      timeEntryActions: {
        getTimeEntries,
        resetTimeEntries
      }
    } = this.props;

    this.setState({
      fromDate: null,
      toDate: null,
      isDateAscending: false
    }, () => {
      resetTimeEntries();
      getTimeEntries({ page: 1 });
    });
  }

  loadMore() {
    const {
      timeEntry: {
        hasMore,
        page
      },
      timeEntryActions: {
        getTimeEntries
      }
    } = this.props;
    if (hasMore) {
      getTimeEntries({ page: page + 1 });
    }
  }

  render() {
    const {
      isShowingTimeEntryForm
    } = this.state;
    const {
      timeEntry: {
        timeEntries,
        isLoading
      },
      timeEntryActions: {
        editTimeEntry,
        removeTimeEntry
      }
    } = this.props;

    return (
      <div>
        {isShowingTimeEntryForm && <Card style={{ ...styles.container }}>
          <Typography type="title">Add new jogging trip</Typography>
          <TimeEntryForm
            onSubmit={this.handleSubmitNewTimeEntry.bind(this)}
            onCancel={this.hideTimeEntryForm.bind(this)}
          />
        </Card>
        }
        {!isShowingTimeEntryForm &&
          <Button type="button" raised color="primary" onClick={this.showTimeEntryForm.bind(this)}>
            + ADD JOGGING TRIP
          </Button>
        }

        <div style={{ marginTop: 20 }}>
          <Infinite
            elementHeight={120}
            containerHeight={window.innerHeight - 240}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.loadMore.bind(this)}
            isInfiniteLoading={isLoading}
            loadingSpinnerDelegate={
              isLoading && <LinearProgress style={{ marginTop: 10 }} />
            }
          >
            {timeEntries.map(timeEntry => (
              <TimeEntryCard
                key={timeEntry.id}
                timeEntry={timeEntry}
                editTimeEntry={editTimeEntry}
                removeTimeEntry={removeTimeEntry}
              />
            ))}
          </Infinite>
        </div>

        <div style={{ ...styles.filterCard }}>
          <FilterForm
            onSubmit={this.handleSubmitFilter.bind(this) }
            onClear={this.handleClearFilter.bind(this)}
          />
        </div>
      </div>
    );
  }
}

MyJoggingTime.propTypes = {
  timeEntry: PropTypes.object.isRequired,
  timeEntryActions: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    timeEntry: state.timeEntry
  };
}

function mapDispatch(dispatch) {
  return {
    timeEntryActions: bindActionCreators(TimeEntryActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(MyJoggingTime);
