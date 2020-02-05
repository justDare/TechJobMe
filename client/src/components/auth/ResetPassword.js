import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  validatePasswordResetToken,
  forgotPasswordEmail,
  updatePasswordViaEmail
} from '../../actions/authActions';
import { Redirect } from 'react-router-dom';

// Material
import { Alert } from '@material-ui/lab';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

export class ResetPassword extends Component {
  state = {
    password: '',
    passwordCheck: '',
    email: '',
    pwdError: false,
    error: false,
    loading: true,
    showPassword: false,
    showCheck: false
  };

  static propTypes = {
    validatePasswordResetToken: PropTypes.func.isRequired,
    forgotPasswordEmail: PropTypes.func.isRequired,
    updatePasswordViaEmail: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { token } = this.props.match.params;
    this.props.validatePasswordResetToken(token);
  }

  componentDidUpdate(prevProps) {
    const { msg } = this.props.auth;

    //  If token is valid show component
    if (prevProps !== this.props) {
      if (msg === 'Token ok') {
        this.setState({
          loading: false,
          email: this.props.auth.user.email
        });

        //  If not valid show error
      } else if (msg === 'Password reset link invalid or expired.') {
        this.setState({
          loading: false,
          error: true
        });
      } else if (msg === 'Password updated.') {
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    if (this.state.pwdError === true) this.setState({ pwdError: false });
  };

  handleClickShowPassword = () => {
    this.setState({
      showPassword: !this.state.showPassword
    });
  };

  handleClickShowCheck = () => {
    this.setState({
      showCheck: !this.state.showCheck
    });
  };

  onSubmit = e => {
    e.preventDefault();
    const { password, passwordCheck } = this.state;

    if (password !== passwordCheck) {
      this.setState({
        pwdError: true
      });
      return;
    }

    const _id = this.props.auth.user._id;
    const { token } = this.props.match.params;

    // Attempt to update password
    this.props.updatePasswordViaEmail({
      password: password,
      _id: _id,
      token: token
    });
  };

  render() {
    const { loading, error } = this.state;
    const { msg } = this.props.auth;

    // If response recieved success, redirect to login
    if (msg === 'Password updated.') {
      return <Redirect to="/" />;
    }

    if (loading) {
      return (
        <Backdrop open="true">
          <CircularProgress color="inherit" />
        </Backdrop>
      );
    } else if (error) {
      return <div>Error</div>;
    } else {
      return (
        <div>
          <Container>
            <div className="login-main">
              <Paper className="login-card" variant="outlined">
                <Typography className="mb-5 text-center" variant="h4">
                  Reset password
                </Typography>
                {this.state.msg ? (
                  <Alert color="danger">{this.state.msg}</Alert>
                ) : null}
                <form onSubmit={this.onSubmit}>
                  <FormControl variant="outlined" className="mb-3" fullWidth>
                    <InputLabel required htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      type={this.state.showPassword ? 'text' : 'password'}
                      onChange={this.onChange}
                      name="password"
                      required={true}
                      error={this.state.pwdError}
                      helperText={
                        this.state.pwdError ? 'Passwords do not match' : ''
                      }
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
                      labelWidth={85}
                    />
                  </FormControl>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel required htmlFor="outlined-adornment-password">
                      Re-type Password
                    </InputLabel>
                    <OutlinedInput
                      type={this.state.showCheck ? 'text' : 'password'}
                      onChange={this.onChange}
                      name="passwordCheck"
                      required={true}
                      error={this.state.pwdError}
                      helperText={
                        this.state.pwdError ? 'Passwords do not match' : ''
                      }
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleClickShowCheck}
                            edge="end"
                          >
                            {this.state.showCheck ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={140}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    color="primary"
                    style={{ marginTop: '2rem' }}
                    className="float-right"
                    block
                  >
                    Reset Password
                  </Button>
                </form>
              </Paper>
            </div>
          </Container>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, {
  validatePasswordResetToken,
  forgotPasswordEmail,
  updatePasswordViaEmail
})(ResetPassword);
