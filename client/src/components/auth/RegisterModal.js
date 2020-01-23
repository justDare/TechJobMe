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
import './Login.scss';

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
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';

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
    showPassword: false,
    showCheck: false,
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
            </Toolbar>
          </AppBar>
          <Container className="h-100">
            <div className="h-100 align-items-center d-flex justify-content-center">
              <Paper
                className="login-card modal-holder text-center"
                variant="outlined"
              >
                <form action="">
                  <Typography className="mb-5" variant="h4">
                    Create Account
                  </Typography>
                  <TextField
                    onChange={this.onChange}
                    className="mb-3"
                    name="email"
                    label="Email"
                    variant="outlined"
                    fullWidth
                  />
                  <TextField
                    onChange={this.onChange}
                    className="mb-3"
                    name="name"
                    label="Name"
                    variant="outlined"
                    fullWidth
                  />
                  <FormControl variant="outlined" className="mb-3" fullWidth>
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
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">
                      Re-type Password
                    </InputLabel>
                    <OutlinedInput
                      type={this.state.showCheck ? 'text' : 'password'}
                      onChange={this.onChange}
                      name="passwordCheck"
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
                      labelWidth={70}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    className="w-50 mt-5"
                    color="primary"
                    onClick={this.onSubmit}
                  >
                    Create
                  </Button>
                </form>
              </Paper>
            </div>
          </Container>
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
