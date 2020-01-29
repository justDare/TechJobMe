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

export class Account extends Component {
  state = {
    modal: false,
    promptModal: false,
    promptModalAppa: false,
    editField: '',
    current: '',
    msg: ''
  };

  static propTypes = {
    user: PropTypes.object,
    editUser: PropTypes.func.isRequired,
    deleteUser: PropTypes.func.isRequired
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  componentDidUpdate(prevProps) {
    const user = this.props.user;

    // Alert when edit successful
    if (user !== prevProps.user) {
      for (var field in user) {
        if (user[field] !== prevProps.user[field]) {
          const fieldUI = field.charAt(0).toUpperCase() + field.substring(1);
          this.setState({
            msg: `${fieldUI} updated successfully!`
          });
        }
      }
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
      promptModal: !this.state.promptModalApps
    });
  };

  deleteAccount = () => {
    this.props.deleteUser(this.props.user._id);
  };

  deleteAllApplications = () => {
    this.props.deleteAllApplications(this.props.user._id);
  };

  render() {
    const user = this.props.user;
    const { modal, promptModal, editField, current } = this.state;

    let editFieldUI = '';
    if (editField)
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
            {this.state.msg ? (
              <Alert color="success">{this.state.msg}</Alert>
            ) : null}
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

          <ListGroup>
            {/* {this.state.msg ? (
              <Alert color="success">{this.state.msg}</Alert>
            ) : null} */}
            {/* <ListGroupItem key={`${user._id}name`}>
              <ListGroupItemHeading>Name</ListGroupItemHeading>
              <ListGroupItemText>{user.name}</ListGroupItemText>
              <MdEdit onClick={() => this.toggle('name', user.name)} />
            </ListGroupItem> */}
            {/* <ListGroupItem key={`${user._id}email`}>
              <ListGroupItemHeading>Email</ListGroupItemHeading>
              <ListGroupItemText>{user.email}</ListGroupItemText>
              <MdEdit onClick={() => this.toggle('email', user.email)} />
            </ListGroupItem> */}
            {/* <ListGroupItem key={`${user._id}password`}>
              <ListGroupItemHeading>Change Password</ListGroupItemHeading>
              <MdEdit onClick={() => this.toggle('password')} />
            </ListGroupItem> */}
          </ListGroup>
        </Paper>
        <Paper variant="outlined" className="grid-paper mt-3" elevation={2}>
          <Toolbar>
            <Typography variant="h6">Danger Zone</Typography>
          </Toolbar>
          {this.state.msg ? (
            <Alert color="success">{this.state.msg}</Alert>
          ) : null}
          <Alert
            variant="outlined"
            severity="error"
            className="ml-4 mr-4 mb-2 align-items-center"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.togglePrompt();
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </IconButton>
            }
          >
            <AlertTitle className="mb-0">Delete My Account</AlertTitle>
          </Alert>
          <Alert
            variant="outlined"
            severity="error"
            className="ml-4 mr-4 mb-2 align-items-center"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  this.togglePromptApps();
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </IconButton>
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
          cancel="Cancel"
          confirm="Delete my account"
        />
        <PromptModal
          modalAction={this.deleteAllApplications}
          toggle={this.togglePromptApps}
          modal={this.state.promptModalApps}
          title="Delete All Applications"
          body="Are you sure you wish to delete all of your applications? All of them will be gone forever."
          cancel="No, I like them"
          confirm="Yes, delete all of my applications"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { editUser, deleteUser })(Account);
