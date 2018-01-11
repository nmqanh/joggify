import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import BackgroundImage from 'images/unsplash_jogging.jpg';
import TextField from 'material-ui/TextField';
import { Link, withRouter } from 'react-router-dom';

const styles = () => ({
  card: {
    margin: '0 auto',
    maxWidth: 500,
    height: 510,
    top: 'calc(50% - 300px)',
    position: 'absolute',
    left: 0,
    right: 0
  },
  button: {
    marginTop: '3em'
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

class SignUpPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{ ...backgroundStyle }}>
        <Card className={classes.card}>
          <CardContent style={{ paddingTop: '4em ' }}>
            <AppBar position="absolute" className={classes.header}>
              <Typography type="title" color="inherit" className={classes.flex}>
                Joggify - Sign up and Track jogging
              </Typography>
            </AppBar>
            <TextField
              label="Full Name"
              type="text"
              placeholder="Full Name"
              className={classes.textField}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Email Address"
              type="email"
              placeholder="Email Address"
              className={classes.textField}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Password"
              type="password"
              placeholder="Password"
              className={classes.textField}
              margin="normal"
              fullWidth
            />

            <TextField
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              className={classes.textField}
              margin="normal"
              fullWidth
            />

            <Button type="submit" raised color="primary" className={classes.button}>
              SIGN UP
            </Button>
          </CardContent>
          <CardActions>
            <Button component={Link} dense to="/">Sign In</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

SignUpPage.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withRouter(SignUpPage));
