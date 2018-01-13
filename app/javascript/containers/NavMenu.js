import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import RunIcon from 'material-ui-icons/DirectionsRun';
import ChartIcon from 'material-ui-icons/ShowChart';
import { NavLink } from 'react-router-dom';

const styles = {
  activeLink: {
    backgroundColor: '#eee'
  }
};

export default class NavMenu extends React.Component {
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
      </div>
    );
  }
}
