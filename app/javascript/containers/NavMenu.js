import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import RunIcon from 'material-ui-icons/DirectionsRun';
import ChartIcon from 'material-ui-icons/ShowChart';
import PeopleIcon from 'material-ui-icons/People';
import { NavLink } from 'react-router-dom';
import Divider from 'material-ui/Divider';

const styles = {
  activeLink: {
    backgroundColor: '#eee'
  }
};

export default class NavMenu extends React.Component {
  canManageUsers() {
    const { role } = this.props;
    return role === 'admin' || role === 'manager';
  }

  render() {
    return (
      <div>
        <ListItem component={NavLink} button activeStyle={{ ...styles.activeLink }} exact to="/">
          <ListItemIcon>
            <RunIcon />
          </ListItemIcon>
          <ListItemText primary="Jogging Trips"/>
        </ListItem>

        <ListItem component={NavLink} button activeStyle={{ ...styles.activeLink }} exact to="/report">
          <ListItemIcon>
            <ChartIcon />
          </ListItemIcon>
          <ListItemText primary="Report" />
        </ListItem>

        {this.canManageUsers() && <Divider/>}

        {this.canManageUsers() &&
          <ListItem component={NavLink} button activeStyle={{ ...styles.activeLink }} exact to="/users">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItem>
        }
      </div>
    );
  }
}


NavMenu.propTypes = {
  role: PropTypes.string.isRequired
};
