import React, { Component } from 'react';
import {
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
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { Redirect } from 'react-router-dom';

// Material
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Alert, AlertTitle } from '@material-ui/lab';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class RegisterModal extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    password: '',
    passwordCheck: '',
    msg: null
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    register: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error, isAuthenticated } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'REGISTER_FAIL') {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }
    }

    // If authenticated, redirect to dashboard
    if (this.state.modal && isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, email, password, passwordCheck } = this.state;

    // Create user object
    const newUser = {
      name,
      email,
      password,
      passwordCheck
    };

    // Attempt to register
    this.props.register(newUser);
  };

  render() {
    console.log(this.state);

    return (
      <div className="text-center mt-5">
        <div>
          <Typography variant="caption" display="block" gutterBottom>
            New to TechJobMe?
          </Typography>
          <Divider />
          <Button
            onClick={this.toggle}
            className="mt-2 w-100"
            variant="outlined"
            color="primary"
          >
            Create Account
          </Button>
        </div>
        <Dialog
          fullScreen
          open={this.state.modal}
          onClose={this.toggle}
          TransitionComponent={Transition}
        >
          <AppBar className="position-relative">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={this.toggle}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography variant="h6">Sound</Typography>
              <Button autoFocus color="inherit" onClick={this.toggle}>
                save
              </Button>
            </Toolbar>
          </AppBar>
        </Dialog>
        {/* <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Register</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                {this.state.msg}
              </Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="name">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className="mb-3"
                  onChange={this.onChange}
                />

                <Label for="name">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Label for="name">Re-Type Password</Label>
                <Input
                  type="password"
                  name="passwordCheck"
                  id="passwordCheck"
                  placeholder="Re-Type Password"
                  className="mb-3"
                  onChange={this.onChange}
                />
                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Register
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
);
