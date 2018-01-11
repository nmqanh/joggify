import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import cx from 'classnames';
import Toolbar from 'material-ui/Toolbar';
import List, { ListItem, ListItemText } from 'material-ui/List';
import { MenuItem, MenuList } from 'material-ui/Menu';
import Grow from 'material-ui/transitions/Grow';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Hidden from 'material-ui/Hidden';
import Divider from 'material-ui/Divider';
import MenuIcon from 'material-ui-icons/Menu';
import Avatar from 'material-ui/Avatar';
import md5 from 'blueimp-md5';
import { Manager, Target, Popper } from 'react-popper';
import { Link } from 'react-router-dom';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import NavMenu from './NavMenu';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'hidden'
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%'
  },
  appBar: {
    position: 'absolute',
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      position: 'relative',
      height: '100%'
    }
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: '100%',
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      height: 'calc(100% - 64px)',
      marginTop: 64
    }
  }
});

class ResponsiveDrawer extends React.Component {
  state = {
    mobileOpen: false,
    open: false
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    this.setState({ open: false });
    this.props.authActions.signOut();
  };

  render() {
    const {
      classes,
      theme,
      children,
      currentUser
    } = this.props;
    const { open } = this.state;

    const drawer = (
      <div>
        <div className={classes.drawerHeader}>
          <Manager>
            <Target>
              <ListItem button onClick={this.handleClick}>
                <Avatar
                  alt="Remy Sharp"
                  src={`https://www.gravatar.com/avatar/${md5(currentUser.email.toLowerCase().trim())}?d=monsterid`}
                  className={classes.avatar}
                />
                <ListItemText primary={currentUser.name} />
              </ListItem>
            </Target>
            <Popper
              placement="bottom-end"
              eventsEnabled={open}
              className={cx({ [classes.popperClose]: !open })}
              style={{
                zIndex: 1,
                width: '80%',
                visibility: open ? 'visible' : 'hidden'
              }}
            >
              <ClickAwayListener onClickAway={this.handleClose}>
                <Grow in={open} id="menu-list" style={{ transformOrigin: '0 0 0' }}>
                  <Paper>
                    <MenuList role="menu">
                      <Link
                        to="/account-settings"
                        style={{
                          textDecoration: 'none',
                          color: 'inherit'
                        }}
                      >
                        <MenuItem onClick={this.handleClose}>My account</MenuItem>
                      </Link>
                      <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                    </MenuList>
                  </Paper>
                </Grow>
              </ClickAwayListener>
            </Popper>
          </Manager>
        </div>
        <Divider />
        <List><NavMenu/></List>
      </div>
    );

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="contrast"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography type="title" color="inherit" noWrap>
                Joggify - Your jogging companion
              </Typography>
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              type="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              style={{ height: '100%' }}
              type="permanent"
              open
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </div>
    );
  }
}

ResponsiveDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  children: PropTypes.array.isRequired,
  authActions: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
