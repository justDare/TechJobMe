import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addApplication } from '../actions/applicationActions';

class ApplicationModal extends Component {
  state = {
    modal: false,
    name: ''
  };

  static propTypes = {
    auth: PropTypes.object
  };

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const newApplication = {
      name: this.state.name,
      user_id: this.props.auth.user._id
    };

    // Add application via add application action
    this.props.addApplication(newApplication);

    // close modal
    this.toggle();
  };

  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{ marginBottom: '2rem' }}
          onClick={this.toggle}
        >
          Add Application
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Application</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="application">Application</Label>
                <Input
                  type="text"
                  name="name"
                  id="application"
                  placeholder="Add Application"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Add Application
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  application: state.application,
  auth: state.auth
});

export default connect(mapStateToProps, { addApplication })(ApplicationModal);
