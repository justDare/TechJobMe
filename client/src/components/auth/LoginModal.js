import React, { Component } from 'react';
import { Form, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
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
import Typography from '@material-ui/core/Typography';
import { Alert, AlertTitle } from '@material-ui/lab';

class LoginModal extends Component {
  state = {
    modal: false,
    email: '',
    password: '',
    showPassword: false,
    msg: null
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
      } else {
        this.setState({ msg: null });
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
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
        <h1 className="text-center mb-5">TechJobMe</h1>
        <Form onSubmit={this.onSubmit}>
          {this.state.msg ? (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {this.state.msg}
            </Alert>
          ) : null}
          <FormGroup>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="outlined-adornment-password">
                Email
              </InputLabel>
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
                onClick={this.onSubmit}
              >
                Login
              </Button>
            </div>
          </FormGroup>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
