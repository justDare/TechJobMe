import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { register } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import { Redirect } from 'react-router-dom';
import './Login.scss';

// Material
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

class RegisterModal extends Component {
  state = {
    modal: false,
    name: '',
    email: '',
    password: '',
    passwordCheck: '',
    showPassword: false,
    showCheck: false,
    msg: null,
    snackBar: false
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
        this.toggleSnack();
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

  handleClickShowCheck = () => {
    this.setState({
      showCheck: !this.state.showCheck
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const { name, email, password, passwordCheck } = this.state;

    if (password !== passwordCheck) {
      this.setState({ msg: 'Passwords do not match.' });
      this.toggleSnack();
      return;
    }

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
            </Toolbar>
          </AppBar>
          <Container className="h-100">
            <div className="h-100 align-items-center d-flex justify-content-center">
              <Paper
                className="login-card modal-holder text-center"
                variant="outlined"
              >
                <form onSubmit={this.onSubmit}>
                  <Typography className="mb-5" variant="h4">
                    Create Account
                  </Typography>
                  <FormControl variant="outlined" className="mb-3" fullWidth>
                    <InputLabel required htmlFor="outlined-adornment-password">
                      Email
                    </InputLabel>
                    <OutlinedInput
                      onChange={this.onChange}
                      name="email"
                      required={true}
                      labelWidth={55}
                    />
                  </FormControl>
                  <FormControl variant="outlined" className="mb-3" fullWidth>
                    <InputLabel required htmlFor="outlined-adornment-password">
                      Name
                    </InputLabel>
                    <OutlinedInput
                      onChange={this.onChange}
                      name="name"
                      required={true}
                      labelWidth={60}
                    />
                  </FormControl>

                  <FormControl variant="outlined" className="mb-3" fullWidth>
                    <InputLabel required htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      type={this.state.showPassword ? 'text' : 'password'}
                      onChange={this.onChange}
                      name="password"
                      required={true}
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
                    variant="contained"
                    className="w-50 mt-5"
                    color="primary"
                    type="submit"
                  >
                    Create
                  </Button>
                </form>
              </Paper>
            </div>
          </Container>
        </Dialog>
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

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
);
