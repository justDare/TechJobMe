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

export default class EditModal extends Component {
  state = {
    fieldInput: "",
    msg: null
  };

  onChange = e => {
    // this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { modal, editField } = this.props;
    console.log(editField);
    return (
      <Modal isOpen={modal} toggle={() => this.props.toggle()}>
        <ModalHeader toggle={() => this.props.toggle()}>
          Edit {editField}
        </ModalHeader>
        <ModalBody>
          {this.state.msg ? (
            <Alert color="danger">{this.state.msg}</Alert>
          ) : null}
          <Form>
            <FormGroup>
              <Label for="application">{editField}</Label>
              <Input
                type="text"
                name={editField}
                placeholder={editField}
                className="mb-3"
                // onChange={this.onChange}
                required
              />
              <Button
                color="dark"
                style={{ marginTop: "2rem" }}
                onClick={() => this.props.toggle()}
                block
              >
                Close
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}
