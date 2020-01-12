import React, { Component, Fragment } from "react";
import { editUser } from "../actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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

export class EditModal extends Component {
  state = {
    fieldInput: "",
    passwordCheck: "",
    msg: null
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    editUser: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, user } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "REGISTER_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If edit successful, close modal
    if (this.props.modal && user !== prevProps.user) {
      this.props.toggle();
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { editField } = this.props;
    const { email } = this.props.user;
    const { fieldInput, passwordCheck } = this.state;

    // Create user edit payload
    const payload = {};

    if (editField === "password" && fieldInput !== passwordCheck) {
      this.setState({
        msg: "Passwords do not match."
      });
      return;
    }

    payload[editField] = fieldInput;
    payload["ref_email"] = email;

    // Attempt to edit
    this.props.editUser(payload);
  };

  render() {
    const { modal, editField, editFieldUI } = this.props;
    let input = (
      <Fragment>
        <Label for="application">{editFieldUI}</Label>
        <Input
          type="text"
          name="fieldInput"
          placeholder={editFieldUI}
          className="mb-3"
          onChange={this.onChange}
          required
        />
      </Fragment>
    );

    // Validation for password changes
    let validateInput = "";
    if (editField === "password") {
      validateInput = (
        <Fragment>
          <Label for="name">Re-Type Password</Label>
          <Input
            type="text"
            name="passwordCheck"
            placeholder="Re-Type Password"
            className="mb-3"
            onChange={this.onChange}
            required
          />
        </Fragment>
      );
    }

    return (
      <Modal isOpen={modal} toggle={() => this.props.toggle()}>
        <ModalHeader toggle={() => this.props.toggle()}>
          Edit {editFieldUI}
        </ModalHeader>
        <ModalBody>
          {this.state.msg ? (
            <Alert color="danger">{this.state.msg}</Alert>
          ) : null}
          <Form onSubmit={this.onSubmit}>
            <FormGroup>
              {input}
              {validateInput}
              <Button color="dark" style={{ marginTop: "2rem" }} block>
                Submit Changes
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  user: state.auth.user
});

export default connect(mapStateToProps, { editUser })(EditModal);
