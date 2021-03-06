import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { Redirect } from 'react-router-dom';
import ForgotPasswordModal from './ForgotPasswordModal';
import Logo from '../../media/logo-full.png';

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

class LoginModal extends Component {
  state = {
    modal: false,
    email: '',
    password: '',
    showPassword: false,
    msg: null,
    snackBar: false
  };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'LOGIN_FAIL') {
        this.setState({ msg: error.msg.msg });
        this.toggleSnack();
      } else {
        this.setState({ msg: null });
      }
    }
  }

  toggleSnack = () => {
    this.setState({
      snackBar: !this.state.snackBar
    });
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  handleKeyDown = e => {
    if (e.key === 'Enter') {
      this.onSubmit(e);
    }
  };

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
    const { isAuthenticated } = this.props;

    // If authenticated, redirect to dashboard
    if (isAuthenticated) return <Redirect to="/dashboard" />;

    return (
      <div>
        <div className="w-100 text-center mb-1">
          <img className="login-logo" src={Logo} alt="TechJobMe logo" />
        </div>
        <form>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Email</InputLabel>
            <OutlinedInput
              name="email"
              type="email"
              onChange={this.onChange}
              className="mb-3"
              onKeyDown={this.handleKeyDown}
              endAdornment={
                <InputAdornment position="end">
                  <AccountCircle edge="end"></AccountCircle>
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
              onKeyDown={this._handleKeyDown}
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
              onClick={this.onSubmit}
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
