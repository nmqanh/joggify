import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import InfiniteScroll from 'react-infinite-scroller';
import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import TimeEntryForm from './forms/TimeEntryForm';
import * as TimeEntryActions from '../actions/TimeEntryActions';
import TimeEntryCard from './TimeEntryCard';


const styles = {
  container: {
    padding: '1em'
  }
};

class MyJoggingTime extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      isShowingTimeEntryForm: false
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

  handleSubmitNewTimeEntry(values) {
    const {
      timeEntryActions
    } = this.props;
    timeEntryActions.addTimeEntry(values);
    this.hideTimeEntryForm();
  }

  loadMore(page) {
    const {
      timeEntry: {
        hasMore
      },
      timeEntryActions: {
        getTimeEntries
      }
    } = this.props;
    if (hasMore) {
      getTimeEntries({ page });
    }
  }

  render() {
    const {
      isShowingTimeEntryForm
    } = this.state;
    const {
      timeEntry: {
        timeEntries,
        hasMore
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
        <div>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore.bind(this)}
            hasMore={hasMore}
            threshold={500}
            useWindow={false}
            loader={<LinearProgress style={{ marginTop: 10 }} />}
          >
            {timeEntries.map(timeEntry => (
              <TimeEntryCard
                key={timeEntry.id}
                timeEntry={timeEntry}
                editTimeEntry={editTimeEntry}
                removeTimeEntry={removeTimeEntry}
              />
            ))}
          </InfiniteScroll>
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
