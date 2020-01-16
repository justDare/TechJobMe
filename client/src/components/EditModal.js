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
import "./modal.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export class EditModal extends Component {
  state = {
    fieldInput: "",
    passwordCheck: "",
    msg: null,
    date: new Date()
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    editUser: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, stateToUpdate } = this.props;
    if (error !== prevProps.error) this.setState({ msg: error.msg.msg });

    // If edit successful, close modal
    if (this.props.modal && stateToUpdate !== prevProps.stateToUpdate) {
      this.props.toggle();
    }
  }

  setDate = pDate => {
    this.setState({
      fieldInput: pDate
    });
  };

  onChange = e => {
    this.setState({ fieldInput: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { editField, stateToUpdate } = this.props;
    const { fieldInput, passwordCheck } = this.state;

    // Create user edit payload
    const payload = {};

    if (editField === "password" && fieldInput !== passwordCheck) {
      this.setState({
        msg: "Passwords do not match."
      });
      return;
    }

    payload["field"] = [editField, fieldInput];
    payload["_id"] = stateToUpdate._id;

    // Attempt to edit
    this.props.editAction(payload);
  };

  // Input may be single input or select
  getInputJSX = (pEditFieldUI, pCurrent, type = "input") => {
    if (this.props.editField === "stage") {
      return (
        <Input type="select" onChange={this.onChange} required>
          <option value="">Select Application Stage</option>
          <option>Application Sent</option>
          <option>No Offer</option>
          <option>Phone Screen</option>
          <option>On-Site</option>
          <option>Offer</option>
        </Input>
      );
    } else if (this.props.editField === "date") {
      return (
        <DatePicker
          selected={Date.parse(this.props.stateToUpdate.date)}
          onChange={date => this.setDate(Date.parse(date))}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          todayButton="Today"
          dateFormat="MMMM d, yyyy h:mm aa"
          shouldCloseOnSelect={true}
        />
      );
    } else {
      return (
        <Fragment>
          <Label for="application">{pEditFieldUI}</Label>
          <Input
            type="text"
            placeholder={pEditFieldUI}
            className="mb-3"
            onChange={this.onChange}
            defaultValue={pCurrent}
            required
          />
        </Fragment>
      );
    }
  };

  render() {
    console.log(typeof this.state.fieldInput);
    const { modal, editField, editFieldUI } = this.props;
    let current = "";
    if (editField !== "password") current = this.props.current;
    let input = this.getInputJSX(editFieldUI, current);

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
