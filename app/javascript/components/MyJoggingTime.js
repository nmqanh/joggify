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
    margin: '0 0 10px 0',
    padding: '1em'
  }
};

class MyJoggingTime extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      ...this.defaultFilterState(),
      isDateAscending: false,
      containerHeight: window.innerHeight - 270
    };

    window.addEventListener('resize', this.updateContainerHeight.bind(this));
  }

  defaultFilterState() {
    const { currentUser } = this.props;
    return {
      fromDate: null,
      toDate: null,
      isDateAscending: false,
      selectedUser: this.isAdmin() ? {
        id: currentUser.id,
        label: `${currentUser.name} - ${currentUser.email}`
      } : null
    };
  }

  isAdmin() {
    const { currentUser: { role } } = this.props;
    return role === 'admin';
  }

  updateContainerHeight() {
    this.setState({
      containerHeight: window.innerHeight - 270
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateContainerHeight.bind(this));
  }

  handleSelectedUserChange(selectedUser) {
    const {
      timeEntryActions
    } = this.props;
    this.setState({
      selectedUser
    }, () => {
      timeEntryActions.resetTimeEntries();
      this.getTimeEntries({ page: 1 });
    });
  }

  componentWillMount() {
    const {
      timeEntryActions
    } = this.props;
    timeEntryActions.resetTimeEntries();
    this.getTimeEntries({ page: 1 });
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
    const { selectedUser } = this.state;
    const {
      timeEntryActions
    } = this.props;
    timeEntryActions.addTimeEntry({
      ...values,
      userId: selectedUser ? selectedUser.id : null
    })
      .then(() => {
        this.getTimeEntries({ page: 1 });
      });
    this.hideTimeEntryForm();
  }

  handleSubmitFilter({ fromDate, toDate, isDateAscending = false }) {
    if (fromDate === this.state.fromDate &&
        toDate === this.setState.toDate &&
        isDateAscending === this.state.isDateAscending
    ) {
      return;
    }
    const {
      timeEntryActions: {
        resetTimeEntries
      }
    } = this.props;
    this.setState({
      fromDate,
      toDate,
      isDateAscending
    }, () => {
      resetTimeEntries();
      this.getTimeEntries({ page: 1 });
    });
  }

  getTimeEntries({ page }) {
    const {
      timeEntryActions: {
        getTimeEntries
      }
    } = this.props;

    const {
      fromDate,
      toDate,
      isDateAscending,
      selectedUser
    } = this.state;

    getTimeEntries({
      page,
      fromDate,
      toDate,
      isDateAscending,
      userId: selectedUser ? selectedUser.id : null
    });
  }

  handleResetFilter() {
    const {
      timeEntryActions: {
        resetTimeEntries
      }
    } = this.props;

    this.setState({
      ...this.defaultFilterState()
    }, () => {
      resetTimeEntries();
      this.getTimeEntries({ page: 1 });
    });
  }

  loadMore() {
    const {
      timeEntry: {
        hasMore,
        page
      }
    } = this.props;
    if (hasMore) {
      this.getTimeEntries({ page: page + 1 });
    }
  }

  handleEditTimeEntry(timeEntry) {
    const {
      timeEntryActions: {
        editTimeEntry
      }
    } = this.props;

    editTimeEntry(timeEntry)
      .then(() => {
        this.getTimeEntries({ page: 1 });
      });
  }

  render() {
    const {
      isShowingTimeEntryForm,
      containerHeight,
      selectedUser
    } = this.state;
    const {
      timeEntry: {
        timeEntries,
        isLoading
      },
      timeEntryActions: {
        removeTimeEntry
      }
    } = this.props;

    return (
      <div>
        <Card style={{ ...styles.filterCard }}>
          <FilterForm
            onSubmit={this.handleSubmitFilter.bind(this) }
            onReset={this.handleResetFilter.bind(this)}
            isAdmin={this.isAdmin()}
            selectedUser={selectedUser}
            onSelectedUserChange={this.handleSelectedUserChange.bind(this)}
          />
        </Card>
        {isShowingTimeEntryForm && <Card style={{ ...styles.container }}>
          <Typography type="title">
            Add new jogging trip
            {selectedUser && <span> for {selectedUser.label}</span>}
          </Typography>
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
            elementHeight={this.isAdmin() ? 144 : 120}
            containerHeight={containerHeight}
            infiniteLoadBeginEdgeOffset={200}
            onInfiniteLoad={this.loadMore.bind(this)}
            isInfiniteLoading={isLoading}
            loadingSpinnerDelegate={
              isLoading && <LinearProgress style={{ marginTop: 10 }} />
            }
          >
            {timeEntries.map(timeEntry => (
              <TimeEntryCard
                isAdmin={this.isAdmin()}
                key={timeEntry.id}
                timeEntry={timeEntry}
                handleEditTimeEntry={this.handleEditTimeEntry.bind(this)}
                removeTimeEntry={removeTimeEntry}
              />
            ))}
          </Infinite>
        </div>

      </div>
    );
  }
}

MyJoggingTime.propTypes = {
  timeEntry: PropTypes.object.isRequired,
  timeEntryActions: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    timeEntry: state.timeEntry,
    currentUser: state.authentication.currentUser
  };
}

function mapDispatch(dispatch) {
  return {
    timeEntryActions: bindActionCreators(TimeEntryActions, dispatch)
  };
}

export default connect(mapState, mapDispatch)(MyJoggingTime);
