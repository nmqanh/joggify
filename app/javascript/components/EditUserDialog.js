import React from 'react';
import PropTypes from 'prop-types';
import Dialog, {
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog';
import EditUserForm from './forms/EditUserForm';

class EditUserDialog extends React.Component {
  render() {
    const {
      onSubmit,
      onClose,
      editingUser,
      currentUser
    } = this.props;

    return (
      <Dialog
        fullWidth
        open={true}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          { editingUser ? `Edit user ${editingUser.name} - ${editingUser.email}` : 'New user'}
        </DialogTitle>
        <DialogContent>
          <EditUserForm
            initialValues={{ ...(editingUser || {}) }}
            editingUser={editingUser}
            currentUser={currentUser}
            actionName={editingUser ? 'UPDATE' : 'ADD' }
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

EditUserDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  editingUser: PropTypes.object
};

export default EditUserDialog;
