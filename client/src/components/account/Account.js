import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AppNavbar from '../AppNavbar';
import { Link } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import {
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from 'reactstrap';
import EditModal from '../EditModal';
import { editUser, deleteUser } from '../../actions/authActions';
import PromptModal from '../PromptModal';
import store from '../../store';
import { loadUser } from '../../actions/authActions';
import { deleteAllApplications } from '../../actions/applicationActions';

// Material
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Alert, AlertTitle } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

export class Account extends Component {
  state = {
    modal: false,
    promptModal: false,
    promptModalApps: false,
    editField: '',
    current: '',
    msg: '',
    snackBar: false
  };

  static propTypes = {
    user: PropTypes.object,
    editUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired,
    deleteAllApplications: PropTypes.func.isRequired
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  componentDidUpdate(prevProps) {
    const { user, application } = this.props;

    // Alert when edit successful
    if (user !== prevProps.user) {
      for (var field in user) {
        if (user[field] !== prevProps.user[field]) {
          const fieldUI = field.charAt(0).toUpperCase() + field.substring(1);
          this.setState({
            msg: `${fieldUI} updated successfully!`
          });
          this.toggleSnack();
        }
      }
    }

    if (application.msg !== prevProps.application.msg) {
      this.setState({
        msg: application.msg
      });
      this.togglePromptApps();
      this.toggleSnack();
    }
  }

  toggle = (editField, current) => {
    this.setState({
      modal: !this.state.modal,
      editField: editField,
      current: current
    });
  };

  togglePrompt = () => {
    this.setState({
      promptModal: !this.state.promptModal
    });
  };

  togglePromptApps = () => {
    this.setState({
      promptModalApps: !this.state.promptModalApps
    });
  };

  deleteAccount = () => {
    this.props.deleteUser(this.props.user._id);
  };

  deleteAllApplications = () => {
    this.props.deleteAllApplications(this.props.user._id);
  };

  toggleSnack = () => {
    this.setState({
      snackBar: !this.state.snackBar
    });
  };

  render() {
    const user = this.props.user;
    const { modal, promptModal, editField, current } = this.state;

    let editFieldUI = '';
    if (editField.length)
      editFieldUI = editField.charAt(0).toUpperCase() + editField.substring(1);

    return (
      <div>
        <EditModal
          modal={modal}
          editField={editField}
          editFieldUI={editFieldUI}
          current={current}
          toggle={this.toggle}
          editAction={this.props.editUser}
          stateToUpdate={user}
        />
        <Paper variant="outlined" className="grid-paper" elevation={2}>
          <Toolbar>
            <Typography variant="h6">Account Settings</Typography>
          </Toolbar>
          <Grid container spacing={1} className="grid-main">
            <Grid
              item
              xs={12}
              className="grid-item"
              onClick={() => this.toggle('name', user.name)}
            >
              <Grid container spacing={1}>
                <Grid item xs={4} className="align-items-center d-flex pl-4">
                  <Typography variant="overline">Name</Typography>
                </Grid>
                <Grid item xs={7} className="align-items-center d-flex">
                  <Typography variant="body1">{user.name}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton edge="end" aria-label="edit">
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              className="grid-item"
              onClick={() => this.toggle('name', user.email)}
            >
              <Grid container spacing={1}>
                <Grid item xs={4} className="align-items-center d-flex pl-4">
                  <Typography variant="overline">Email</Typography>
                </Grid>
                <Grid item xs={7} className="align-items-center d-flex">
                  <Typography variant="body1">{user.email}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton edge="end" aria-label="edit">
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              className="grid-item"
              onClick={() => this.toggle('password')}
            >
              <Grid container spacing={1}>
                <Grid item xs={11} className="align-items-center d-flex pl-4">
                  <Typography variant="overline">Change Password</Typography>
                </Grid>
                <Grid item xs={1}>
                  <IconButton edge="end" aria-label="edit">
                    <ArrowForwardIosIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        <Paper variant="outlined" className="grid-paper mt-3" elevation={2}>
          <Toolbar>
            <Typography variant="h6">Danger Zone</Typography>
          </Toolbar>
          <Alert
            variant="outlined"
            severity="error"
            className="ml-4 mr-4 mb-2 align-items-center"
            action={
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.togglePrompt();
                }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            }
          >
            <AlertTitle className="mb-0">Delete My Account</AlertTitle>
          </Alert>
          <Alert
            variant="outlined"
            severity="error"
            className="ml-4 mr-4 mb-2 align-items-center"
            action={
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  this.togglePromptApps();
                }}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            }
          >
            <AlertTitle className="mb-0">Delete All My Applications</AlertTitle>
          </Alert>
        </Paper>
        <PromptModal
          modalAction={this.deleteAccount}
          toggle={(this, this.togglePrompt)}
          modal={promptModal}
          title="Delete User Account"
          body="Are you sure you wish to delete your account? All of your data will be gone forever."
        />
        <PromptModal
          modalAction={this.deleteAllApplications}
          toggle={this.togglePromptApps}
          modal={this.state.promptModalApps}
          title="Delete All Applications"
          body="Are you sure you wish to delete all of your applications? All of them will be gone forever."
        />
        <Snackbar
          open={this.state.snackBar}
          onClose={this.toggleSnack}
          TransitionComponent={TransitionUp}
          autoHideDuration={6000}
        >
          <Alert severity="success" variant="filled" onClose={this.toggleSnack}>
            {this.state.msg}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user,
  application: state.application
});

export default connect(mapStateToProps, {
  editUser,
  deleteUser,
  deleteAllApplications
})(Account);
