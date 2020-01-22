import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText,
  Alert
} from 'reactstrap';

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
      console.log(field);
      if (!nonUIFields[field]) {
        let fieldHeadingUI = field.charAt(0).toUpperCase() + field.substring(1);
        if (field === 'name') fieldHeadingUI = `Company Name`;
        let fieldInfoUI;
        if (field === 'date')
          fieldInfoUI = formatDateString(application[field]);
        else if (application[field] === '') fieldInfoUI = 'N/A';
        else fieldInfoUI = application[field];

        fields.push(
          <ListGroupItem key={field}>
            <ListGroupItemHeading>{fieldHeadingUI}</ListGroupItemHeading>
            <ListGroupItemText>{fieldInfoUI}</ListGroupItemText>
            <MdEdit onClick={() => this.toggle(field, application[field])} />
          </ListGroupItem>
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
        <AppNavbar />
        <Container>
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
            <Button className="mb-3" color="primary">
              Back
            </Button>
          </Link>
          <h1 className="mb-3">{application.name} Application</h1>
          <ListGroup>
            {this.state.msg ? (
              <Alert color="success">{this.state.msg}</Alert>
            ) : null}
            {fields}
          </ListGroup>
        </Container>
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
