import React, { Component } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addApplication } from "../actions/applicationActions";

class ApplicationModal extends Component {
  state = {
    modal: false,
    name: "",
    position: "",
    link: "",
    contact: "",
    msg: null
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "ADD_APPLICATION_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, close modal
    if (this.state.modal && isAuthenticated) {
      // redirect to dashboard
      // this.toggle();
    }
  }

  static propTypes = {
    auth: PropTypes.object,
    error: PropTypes.object.isRequired
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
      user_id: this.props.auth.user._id,
      position: this.state.position,
      link: this.state.link,
      contact: this.state.position
    };

    // Add application via add application action
    this.props.addApplication(newApplication);

    // close modal
    // this.toggle();
  };

  render() {
    return (
      <div>
        <Button
          color="dark"
          style={{ marginBottom: "2rem" }}
          onClick={this.toggle}
        >
          Add Application
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Add Application</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="application">Application</Label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Company Name"
                  className="mb-3"
                  onChange={this.onChange}
                  required
                />
                <Input
                  type="text"
                  name="position"
                  placeholder="Position"
                  className="mb-3"
                  onChange={this.onChange}
                  required
                />
                <Input
                  type="text"
                  name="link"
                  placeholder="Job Posting URL"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Input
                  type="text"
                  name="contact"
                  placeholder="Recruiter Contact Email"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: "2rem" }} block>
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
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, { addApplication })(ApplicationModal);
