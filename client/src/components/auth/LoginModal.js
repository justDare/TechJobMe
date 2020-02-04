import React, { Component } from 'react';
<<<<<<< HEAD
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert
} from 'reactstrap';
=======
>>>>>>> dev
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
<<<<<<< HEAD
=======
import { Redirect } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';

// Material
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import Slide from '@material-ui/core/Slide';
import Snackbar from '@material-ui/core/Snackbar';

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};
>>>>>>> dev

class LoginModal extends Component {
  state = {
    modal: false,
    email: '',
    password: '',
<<<<<<< HEAD
    msg: null
=======
    showPassword: false,
    msg: null,
    snackBar: false
>>>>>>> dev
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
<<<<<<< HEAD
    const { error, isAuthenticated } = this.props;
=======
    const { error } = this.props;
>>>>>>> dev
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.msg });
<<<<<<< HEAD
=======
        this.toggleSnack();
>>>>>>> dev
      } else {
        this.setState({ msg: null });
      }
    }
<<<<<<< HEAD

    // If authenticated, close modal
    if (this.state.modal && isAuthenticated) {
      this.toggle();
    }
  }

  toggle = () => {
    // Clear errors
    this.props.clearErrors();
    this.setState({
      modal: !this.state.modal
=======
  }

  toggleSnack = () => {
    this.setState({
      snackBar: !this.state.snackBar
>>>>>>> dev
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

<<<<<<< HEAD
=======
  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

>>>>>>> dev
  onSubmit = e => {
    e.preventDefault();

    const { email, password } = this.state;

    const user = {
      email,
      password
    };

    // Attempt to login
    this.props.login(user);
  };

  render() {
<<<<<<< HEAD
    return (
      <div>
        <NavLink onClick={this.toggle} href="#">
          Login
        </NavLink>

        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Login</ModalHeader>
          <ModalBody>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
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
                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Login
                </Button>
              </FormGroup>
            </Form>
          </ModalBody>
        </Modal>
=======
    const { isAuthenticated } = this.props;

    // If authenticated, redirect to dashboard
    if (isAuthenticated) return <Redirect to="/dashboard" />;

    return (
      <div>
        <h1 className="text-center mb-5">TechJobMe</h1>
        <form onSubmit={this.onSubmit}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
            <OutlinedInput
              name="email"
              onChange={this.onChange}
              className="mb-3"
              endAdornment={
                <InputAdornment position="end">
                  <AccountCircle
                    aria-label="toggle password visibility"
                    edge="end"
                  ></AccountCircle>
                </InputAdornment>
              }
              labelWidth={40}
            />
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              type={this.state.showPassword ? 'text' : 'password'}
              onChange={this.onChange}
              name="password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    edge="end"
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <div className="w-100 mt-5 d-flex login-form-footer">
            <ForgotPasswordModal />
            <Button
              variant="contained"
              className="w-50"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </div>
        </form>
        <Snackbar
          open={this.state.snackBar}
          onClose={this.toggleSnack}
          TransitionComponent={TransitionUp}
          autoHideDuration={6000}
        >
          <Alert severity="error" variant="filled" onClose={this.toggleSnack}>
            {this.state.msg}
          </Alert>
        </Snackbar>
>>>>>>> dev
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
