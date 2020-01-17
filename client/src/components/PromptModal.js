import React, { Component } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Alert,
  ModalFooter
} from 'reactstrap';

// Props Required: action, toggle, title, body, cancel, confirm

export default class PromptModal extends Component {
  state = {
    modal: false,
    msg: null
  };

  modalAction = () => {
    console.log('this modal does ...');
    this.props.modalAction();
  };

  render() {
    return (
      <div>
        <Modal isOpen={this.props.modal} toggle={this.props.toggle}>
          <ModalHeader toggle={this.props.toggle}>
            {this.props.title}
          </ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            {this.props.body}
          </ModalBody>
          <ModalFooter>
            <Button
              color="dark"
              style={{ marginTop: '2rem' }}
              onClick={this.props.toggle}
              block
            >
              {this.props.cancel}
            </Button>
            <Button color="danger" onClick={this.modalAction} block>
              {this.props.confirm}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
