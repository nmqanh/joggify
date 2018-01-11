import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from 'material-ui/Snackbar';

class Toaster extends React.Component {
  render() {
    const {
      open, message, duration, onClose
    } = this.props;

    return (
      <span>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          message={message}
          autoHideDuration={duration || 4000}
          onClose={onClose}
          style={{
            height: 'auto', lineHeight: '28px', whiteSpace: 'pre-line'
          }}
        />
      </span>
    );
  }
}

Toaster.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  message: PropTypes.string,
  duration: PropTypes.number
};

export default Toaster;
