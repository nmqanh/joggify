import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import BackgroundImage from 'images/unsplash_jogging.jpg';
import { Link, withRouter } from 'react-router-dom';

import ForgotForm from '../forms/ForgotForm';

const styles = () => ({
  card: {
    margin: '0 auto',
    maxWidth: 500,
    height: 'auto',
    top: 'calc(50% - 180px)',
    position: 'absolute',
    left: 0,
    right: 0
  },
  flex: {
    flex: 1
  },
  header: {
    padding: '1em'
  }
});

const backgroundStyle = {
  background: `url(${BackgroundImage.toString()}) no-repeat center center`,
  backgroundSize: 'cover',
  position: 'fixed',
  top: 0,
  right: 0,
  left: 0,
  bottom: 0
};

class ForgotPage extends React.Component {
  handleForgotSubmit(values) {
    const {
      email
    } = values;
    const {
      authActions: {
        forgetPassword
      },
      history
    } = this.props;

    forgetPassword({ email })
      .then(() => {
        history.push('/');
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ ...backgroundStyle }}>
        <Card className={classes.card}>
          <CardContent style={{ paddingTop: '4em ' }}>
            <AppBar position="absolute" className={classes.header}>
              <Typography type="title" color="inherit" className={classes.flex}>
                Joggify - Reset your password
              </Typography>
            </AppBar>
            <ForgotForm onSubmit={this.handleForgotSubmit.bind(this)}/>
          </CardContent>
          <CardActions>
            <Button component={Link} dense to="/signup">Create an account</Button>
            <Button component={Link} dense to="/">Sign in</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

ForgotPage.propTypes = {
  classes: PropTypes.object.isRequired,
  authActions: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(ForgotPage));
