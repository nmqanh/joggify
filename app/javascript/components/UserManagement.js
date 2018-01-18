import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
  TablePagination,
  TableHead
} from 'material-ui/Table';

import Card from 'material-ui/Card';
import Button from 'material-ui/Button';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import { LinearProgress } from 'material-ui/Progress';
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withStyles } from 'material-ui/styles';
import { connect } from 'react-redux';

import * as UserActions from '../actions/UserActions';
import UserFilterForm from './forms/UserFilterForm';
import EditUserDialog from './EditUserDialog';
import ConfirmDialog from './shared/ConfirmDialog';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  card: {
    padding: '10px 20px',
    marginBottom: 20
  },
  newUserBtn: {
    marginBottom: 20
  }
});

class UserManagement extends React.Component {
  constructor() {
    super(...arguments);

    this.state = {
      query: '',
      role: 'all',
      isEditUserDialogOpen: false,
      editingUser: null,
      removingUser: null
    };
  }

  canManageUsers() {
    const { authentication: { currentUser: { role } } } = this.props;
    return role === 'admin' || role === 'manager';
  }

  componentDidMount() {
    this.handleSearch({ page: 1 });
  }

  handleCloseEditUserDialog() {
    this.setState({
      editingUser: null,
      isEditUserDialogOpen: false
    });
  }

  handleSearch({ page }) {
    const {
      userActions: {
        getUsers
      }
    } = this.props;
    const {
      query,
      role
    } = this.state;

    getUsers({ page, query, role });
  }

  handleChangePage = (_, page) => {
    this.handleSearch({ page: page + 1 });
  };

  handleFilterReset() {
    const {
      user: { page }
    } = this.props;
    this.setState({
      query: '',
      role: 'all'
    }, () => {
      this.handleSearch({ page });
    });
  }

  handleFilterChange(nextState) {
    const {
      user: { page }
    } = this.props;

    this.setState({
      ...nextState
    }, () => {
      this.handleSearch({ page });
    });
  }

  handleClickNewUserButton() {
    this.setState({
      isEditUserDialogOpen: true,
      editingUser: null
    });
  }

  handleClickEditUserButton(editingUser) {
    this.setState({
      isEditUserDialogOpen: true,
      editingUser
    });
  }

  handleSubmitNewUser(values) {
    const {
      userActions: {
        addUser
      }
    } = this.props;

    addUser(values).then(() => {
      this.handleCloseEditUserDialog();
      this.handleSearch({ page: 1 });
    });
  }

  handleSubmitEditUser(values) {
    const {
      userActions: {
        editUser
      },
      user: { page }
    } = this.props;

    editUser(values).then(() => {
      this.handleCloseEditUserDialog();
      this.handleSearch({ page });
    });
  }

  handleCancelRemovingUser() {
    this.setState({
      removingUser: null
    });
  }

  handleConfirmRemovingUser(removingUser) {
    this.setState({
      removingUser
    });
  }

  handleRemoveUser() {
    const {
      userActions: {
        removeUser
      }
    } = this.props;

    removeUser(this.state.removingUser.id);
    this.handleCancelRemovingUser();
  }

  shouldShowRemoveIcon(user) {
    const {
      authentication: {
        currentUser: {
          id: currentUserId
        }
      }
    } = this.props;

    return user.id !== currentUserId && this.shouldShowEditIcon(user);
  }

  shouldShowEditIcon(user) {
    const {
      authentication: {
        currentUser: {
          role: currentRole
        }
      }
    } = this.props;

    return (currentRole === 'admin' || user.role !== 'admin');
  }

  render() {
    if (!this.canManageUsers()) {
      return <div/>;
    }

    const {
      classes,
      user: {
        perPage,
        users,
        total,
        page,
        isLoading
      },
      authentication: {
        currentUser: {
          role: currentRole
        }
      }
    } = this.props;
    const {
      query,
      role,
      isEditUserDialogOpen,
      editingUser,
      removingUser
    } = this.state;
    return (
      <div>
        <Card className={classes.card}>
          <UserFilterForm
            query={query}
            role={role}
            onChange={this.handleFilterChange.bind(this)}
            onReset={this.handleFilterReset.bind(this)}
          />
        </Card>

        <Button
          className={classes.newUserBtn}
          type="button"
          raised
          color="primary"
          onClick={this.handleClickNewUserButton.bind(this)}
        >
          + ADD USER
        </Button>

        {isLoading &&
          <LinearProgress style={{ marginTop: 10 }}/>
        }

        <Card className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Time zone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>
                    {this.shouldShowEditIcon(user) &&
                      <EditIcon
                        color="primary"
                        onClick={this.handleClickEditUserButton.bind(this, user)}
                        style={{ height: 20, cursor: 'pointer' }}
                      />
                    }
                    {user.id}
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.timezone}</TableCell>
                  <TableCell>
                    {user.role.toUpperCase()}
                  </TableCell>
                  <TableCell numeric>
                    {this.shouldShowRemoveIcon(user) &&
                      <DeleteIcon
                        color="error"
                        onClick={this.handleConfirmRemovingUser.bind(this, user)}
                        style={{ height: 20, cursor: 'pointer' }}
                      />
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={total}
                  rowsPerPage={perPage}
                  page={page - 1}
                  rowsPerPageOptions={[perPage]}
                  onChangePage={this.handleChangePage.bind(this)}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
        {isEditUserDialogOpen &&
          <EditUserDialog
            editingUser={editingUser}
            currentRole={currentRole}
            onSubmit={
              editingUser ? this.handleSubmitEditUser.bind(this)
                : this.handleSubmitNewUser.bind(this)
            }
            onClose={this.handleCloseEditUserDialog.bind(this)}
          />
        }

        {removingUser &&
          <ConfirmDialog
            confirmTitle="Do you want to remove this user?"
            confirmText={`${removingUser.name} - ${removingUser.email}`}
            onCancel={this.handleCancelRemovingUser.bind(this)}
            onConfirm={this.handleRemoveUser.bind(this)}
          />
        }
      </div>
    );
  }
}

UserManagement.propTypes = {
  authentication: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

function mapState(state) {
  return {
    authentication: state.authentication,
    user: state.user
  };
}

function mapDispatch(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch)
  };
}

export default withStyles(styles)(connect(mapState, mapDispatch)(UserManagement));
