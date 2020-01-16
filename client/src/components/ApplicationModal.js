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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ApplicationModal extends Component {
  state = {
    modal: false,
    name: "",
    position: "",
    link: "",
    contact: "",
    stage: "",
    date: new Date(),
    msg: null
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === "ADD_APPLICATION_FAIL") {
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

  toggle = () => {
    this.setState({
      modal: !this.state.modal
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
    this.props.addApplication(newApplication);
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
