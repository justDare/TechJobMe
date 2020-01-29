import React, { Component } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addApplication } from '../actions/applicationActions';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Material
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

class ApplicationModal extends Component {
  state = {
    modal: false, // delete
    dialog: false,
    name: '',
    position: '',
    link: '',
    contact: '',
    stage: '',
    date: new Date(),
    msg: null
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'ADD_APPLICATION_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    const { application } = this.props;

    // If application added, close modal
    if (this.state.modal && application !== prevProps.application) {
      this.toggle();
    }
  }

  static propTypes = {
    auth: PropTypes.object,
    error: PropTypes.object.isRequired
  };

  toggleDialog = () => {
    this.setState({
      dialog: !this.state.dialog
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setDate = pDate => {
    this.setState({
      date: pDate
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newApplication = {
      name: this.state.name,
      user_id: this.props.auth.user._id,
      position: this.state.position,
      link: this.state.link,
      contact: this.state.contact,
      stage: this.state.stage,
      date: this.state.date
    };

    // Add application via add application action
    this.toggleDialog();
    this.props.addApplication(newApplication);
  };

  render() {
    return (
      <div className="mt-1 mb-2 pl-2">
        <Fab variant="extended" onClick={this.toggleDialog}>
          <AddIcon className="mr-2" size="medium" />
          Add Application
        </Fab>

        <Dialog
          open={this.state.dialog}
          onClose={this.toggleDialog}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Application</DialogTitle>
          <DialogContent>
            <form onSubmit={this.onSubmit}>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Company name"
                type="text"
                onChange={this.onChange}
                required
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                name="position"
                label="Position"
                type="text"
                onChange={this.onChange}
                required
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                name="link"
                label="Job posting URL"
                type="text"
                onChange={this.onChange}
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                name="contact"
                label="Recruiter Contact Email"
                type="text"
                onChange={this.onChange}
                fullWidth
              />
              <FormControl margin="dense" className="mt-3" fullWidth>
                <Select
                  name="stage"
                  value={this.state.stage}
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
              <div className="text-right mt-4">
                <Button onClick={this.toggleDialog} color="primary">
                  Cancel
                </Button>
                <Button type="submit" color="primary">
                  Add Application
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

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
                <Label for="position">Position</Label>
                <Input
                  type="text"
                  name="position"
                  placeholder="Position"
                  className="mb-3"
                  onChange={this.onChange}
                  required
                />
                <Label for="application">Posting Link</Label>
                <Input
                  type="text"
                  name="link"
                  placeholder="Job Posting URL"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Label for="contact">Contact Email</Label>
                <Input
                  type="text"
                  name="contact"
                  placeholder="Recruiter Contact Email"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Label for="selectStage">Application Stage</Label>
                <Input
                  type="select"
                  name="stage"
                  className="mb-3"
                  onChange={this.onChange}
                  required
                >
                  <option value="">Select Application Stage</option>
                  <option>Application Sent</option>
                  <option>No Offer</option>
                  <option>Phone Screen</option>
                  <option>On-Site</option>
                  <option>Offer</option>
                </Input>
                <Label for="date" className="d-block">
                  Select Date
                </Label>
                <DatePicker
                  selected={this.state.date}
                  onChange={date => this.setDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  todayButton="Today"
                  shouldCloseOnSelect={true}
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
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, { addApplication })(ApplicationModal);
