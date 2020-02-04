import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link, Redirect } from 'react-router-dom';
import EditModal from '../components/EditModal';
import {
  editApplication,
  deleteApplication
} from '../actions/applicationActions';
import { formatDateString } from '../utilities/helperFunctions';
import store from '../store';
import { loadUser } from '../actions/authActions';
import './JobApplications.scss';

// Material
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

export class Application extends Component {
  state = {
    modal: false,
    editField: '',
    current: '',
    msg: '',
    snackBar: false,
    redirect: false
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  static getDerivedStateFromProps(props, state) {
    // set redirect when application deleted
    if (props.applicationMsg === 'Application deleted!') {
      return {
        redirect: true
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const application = this.props.application;

    // Alert when edit successful
    if (application !== prevProps.application) {
      for (var field in application) {
        if (application[field] !== prevProps.application[field]) {
          const fieldUI = field.charAt(0).toUpperCase() + field.substring(1);
          this.setState({
            msg: `${fieldUI} updated successfully!`
          });
          this.toggleSnack();
        }
      }
    }
  }

  toggle = (editField = '', current = '') => {
    this.setState({
      modal: !this.state.modal,
      editField: editField,
      current: current
    });
  };

  toggleSnack = () => {
    this.setState({
      snackBar: !this.state.snackBar
    });
  };

  deleteApplication = () => {
    const id = this.props.match.params._id;
    this.props.deleteApplication(id);
  };

  getFields = () => {
    const application = this.props.application;
    let fields = [];

    // feilds to exlcude from the ui
    const nonUIFields = {
      _id: true,
      __v: true,
      user_id: true
    };

    let keyCount = 0;
    for (let field in application) {
      if (!nonUIFields[field]) {
        let fieldHeadingUI = field.charAt(0).toUpperCase() + field.substring(1);
        if (field === 'name') fieldHeadingUI = `Company Name`;
        let fieldInfoUI;
        if (field === 'date')
          fieldInfoUI = formatDateString(application[field]);
        else if (application[field] === '') fieldInfoUI = 'N/A';
        else fieldInfoUI = application[field];

        fields.push(
          <Grid
            item
            xs={12}
            className="grid-item"
            key={`outer-${application._id}-${keyCount}`}
            onClick={() => this.toggle(field, application[field])}
          >
            <Grid container spacing={1}>
              <Grid
                key={`inner-${application._id}`}
                item
                xs={4}
                className="align-items-center d-flex pl-4"
              >
                <Typography variant="overline">{fieldHeadingUI}</Typography>
              </Grid>
              <Grid item xs={7} className="align-items-center d-flex">
                <Typography variant="body1">{fieldInfoUI}</Typography>
              </Grid>
              <Grid item xs={1}>
                <IconButton edge="end" aria-label="edit">
                  <ArrowForwardIosIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        );
      }
      keyCount++;
    }

    return fields;
  };

  render() {
    if (this.state.redirect) return <Redirect to="/dashboard" />;

    const application = this.props.application;
    const fields = this.getFields();
    const { modal, editField, current } = this.state;

    let editFieldUI = '';
    if (editField.length)
      editFieldUI = editField.charAt(0).toUpperCase() + editField.substring(1);

    return (
      <div>
        <EditModal
          modal={modal}
          editField={editField}
          editFieldUI={editFieldUI}
          toggle={this.toggle}
          current={current}
          editSuccess={this.editSuccess}
          editAction={this.props.editApplication}
          stateToUpdate={application}
        />
        <Link to="/dashboard">
          <ArrowBackIcon className="mb-3" />
        </Link>
        <Paper variant="outlined" elevation={2} className="grid-paper">
          <Toolbar className="d-flex justify-content-between">
            <Typography variant="h6">{application.name} Application</Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.deleteApplication}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </Toolbar>
          <Grid container spacing={1} className="grid-main">
            {fields}
          </Grid>
        </Paper>
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

Application.propTypes = {
  application: PropTypes.object,
  editApplication: PropTypes.func.isRequired,
  deleteApplication: PropTypes.func.isRequired,
  applicationMsg: PropTypes.string
};

const mapStateToProps = (state, ownProps) => ({
  application: _.find(state.application.applications, [
    '_id',
    ownProps.match.params._id
  ]),
  applicationMsg: state.application.msg
});

export default connect(mapStateToProps, { editApplication, deleteApplication })(
  Application
);
