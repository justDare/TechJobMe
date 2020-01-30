import React, { Component, Fragment } from 'react';
import { editUser } from '../actions/authActions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import './modal.scss';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateString } from '../utilities/helperFunctions';

// Material
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export class EditModal extends Component {
  state = {
    fieldInput: '',
    passwordCheck: '',
    msg: null,
    date: null
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    editUser: PropTypes.func.isRequired
  };

  static getDerivedStateFromProps(props, state) {
    if (props.editField === 'date' && state.date === null) {
      console.log(props.current);
      return {
        date: props.current
      };
    }
    return null;
  }

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
      date: pDate
    });
  };

  onChange = e => {
    this.setState({ fieldInput: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { editField, stateToUpdate } = this.props;
    const { fieldInput, passwordCheck, date } = this.state;

    // Create user edit payload
    const payload = {};

    if (editField === 'password' && fieldInput !== passwordCheck) {
      this.setState({
        msg: 'Passwords do not match.'
      });
      return;
    }

    if (editField === 'date') payload['field'] = [editField, date];
    else payload['field'] = [editField, fieldInput];
    payload['_id'] = stateToUpdate._id;

    // Attempt to edit
    this.props.editAction(payload);
  };

  // Input may be single input or select
  getInputJSX = (pEditFieldUI, pCurrent, type = 'input') => {
    if (this.props.editField === 'stage') {
      return (
        <FormControl margin="dense" className="mt-3" fullWidth>
          <Select
            name="stage"
            value={this.state.fieldInput}
            onChange={this.onChange}
            displayEmpty
            required
            autoWidth
          >
            <MenuItem value="" disabled>
              Application stage
            </MenuItem>
            <MenuItem value="Application Sent">Application Sent</MenuItem>
            <MenuItem value="No Offer">No Offer</MenuItem>
            <MenuItem value="Phone Screen">Phone Screen</MenuItem>
            <MenuItem value="On-Site">On-Site</MenuItem>
            <MenuItem value="Offer">Offer</MenuItem>
          </Select>
        </FormControl>
      );
    } else if (this.props.editField === 'date') {
      console.log(this.props);
      console.log(this.state);
      console.log(formatDateString(this.props.current));
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="MM/dd/yyyy"
            margin="dense"
            label="Select a date"
            value={this.state.date}
            onChange={this.setDate}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
          />
        </MuiPickersUtilsProvider>
      );
    } else {
      return (
        <Fragment>
          <TextField
            autoFocus
            margin="dense"
            label={pEditFieldUI}
            defaultValue={pCurrent}
            type="text"
            onChange={this.onChange}
            required
            fullWidth
          />
        </Fragment>
      );
    }
  };

  render() {
    const { modal, editField, editFieldUI } = this.props;
    let current = '';
    if (editField !== 'password') current = this.props.current;
    let input = this.getInputJSX(editFieldUI, current);

    // Validation for password changes
    let validateInput = '';
    if (editField === 'password') {
      validateInput = (
        <Fragment>
          <TextField
            autoFocus
            margin="dense"
            label="Re-Type Password"
            type="text"
            onChange={this.onChange}
            required
            fullWidth
          />
        </Fragment>
      );
    }

    return (
      <Dialog
        open={modal}
        onClose={this.props.toggle}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">Edit {editFieldUI}</DialogTitle>
        <DialogContent>
          {this.state.msg ? (
            <Alert color="danger">{this.state.msg}</Alert>
          ) : null}
          <form onSubmit={this.onSubmit}>
            {input}
            {validateInput}
            <div className="text-right mt-4">
              <Button onClick={this.props.toggle} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  user: state.auth.user
});

export default connect(mapStateToProps, { editUser })(EditModal);
