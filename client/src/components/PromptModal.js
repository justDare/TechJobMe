import React, { Component } from 'react';

// Material
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Props Required: action, toggle, title, body
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
        <Dialog
          open={this.props.modal}
          onClose={this.props.toggle}
          aria-labelledby="form-dialog-title"
          TransitionComponent={Transition}
        >
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.msg ? (
                <Alert color="danger">{this.state.msg}</Alert>
              ) : null}
              {this.props.body}
            </DialogContentText>
            <div className="text-right mt-4">
              <Button onClick={this.props.toggle} color="primary">
                Cancel
              </Button>
              <Button onClick={this.modalAction} color="secondary">
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
