import React, { Component } from 'react';
import { Container, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { MdEdit } from 'react-icons/md';
import EditModal from '../components/EditModal';
import { editApplication } from '../actions/applicationActions';
import { formatDateString } from '../utilities/helperFunctions';
import store from '../store';
import { loadUser } from '../actions/authActions';
import './JobApplications.scss';

// Material
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

export class Application extends Component {
  state = {
    modal: false,
    editField: '',
    current: '',
    msg: ''
  };

  componentDidMount() {
    store.dispatch(loadUser());
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

  getFields = () => {
    const application = this.props.application;
    let fields = [];

    // feilds to exlcude from the ui
    const nonUIFields = {
      _id: true,
      __v: true,
      user_id: true
    };

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
            onClick={() => this.toggle(field, application[field])}
          >
            <Grid container spacing={1}>
              <Grid item xs={4} className="align-items-center d-flex pl-4">
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
    }

    return fields;
  };

  render() {
    const application = this.props.application;
    const fields = this.getFields();
    const { modal, editField, current } = this.state;

    let editFieldUI = '';
    if (editField)
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
          <Toolbar>
            <Typography variant="h6">{application.name} Application</Typography>
          </Toolbar>
          <Grid container spacing={1} className="grid-main">
            {this.state.msg ? (
              <Alert color="success">{this.state.msg}</Alert>
            ) : null}
            {fields}
          </Grid>
        </Paper>
      </div>
    );
  }
}

Application.propTypes = {
  application: PropTypes.object.isRequired,
  editApplication: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  application: _.find(state.application.applications, [
    '_id',
    ownProps.match.params._id
  ])
});

export default connect(mapStateToProps, { editApplication })(Application);
