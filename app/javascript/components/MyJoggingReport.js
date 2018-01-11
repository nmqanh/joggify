import React from 'react';
import { connect } from 'react-redux';


class MyJoggingReport extends React.Component {
  render() {
    return (
      <div>
        This is my jogging report
      </div>
    );
  }
}

MyJoggingReport.propTypes = {
};

function mapState() {
  return {
  };
}

function mapDispatch() {
  return {
  };
}

export default connect(mapState, mapDispatch)(MyJoggingReport);
