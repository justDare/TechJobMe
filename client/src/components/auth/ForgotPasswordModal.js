import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../../actions/errorActions';
import { forgotPasswordEmail } from '../../actions/authActions';
import { clearAuthMessage } from '../../actions/authActions';

// Material
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

export class ForgotPasswordModal extends Component {
  state = {
    modal: false,
    snackBar: false,
    email: '',
    msg: null
  };

  static propTypes = {
    error: PropTypes.object.isRequired,
    clearErrors: PropTypes.func.isRequired,
    forgotPasswordEmail: PropTypes.func.isRequired,
    clearAuthMessage: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.clearAuthMessage();
  }

  componentDidUpdate(prevProps) {
    const { error, auth } = this.props;
    if (error !== prevProps.error) {
      // Check for register error
      if (error.id === 'EMAIL_NOT_IN_DB') {
        this.setState({ msg: error.msg });
        this.toggleSnack();
      } else {
        this.setState({ msg: null });
      }
    }
    if (auth !== prevProps.auth) {
      if (auth.msg === 'Recovery email sent!' && this.state.modal)
        this.toggle();
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
    e.preventDefault();
    this.setState({ email: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.forgotPasswordEmail({ email: this.state.email });
  };

  render() {
    return (
      <div className="forgot-password">
        <h6
          className="text-primary"
          onClick={this.toggle}
          style={{ cursor: 'pointer' }}
        >
          Forgot password?
        </h6>

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
                <form>
                  <Typography className="mb-5" variant="h4">
                    Send Password Reset Link
                  </Typography>
                  <FormControl variant="outlined" className="mb-3" fullWidth>
                    <InputLabel required htmlFor="outlined-adornment-password">
                      Account Email
                    </InputLabel>
                    <OutlinedInput
                      onChange={this.onChange}
                      required={true}
                      labelWidth={120}
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    className="w-50 mt-5"
                    color="primary"
                    onClick={this.onSubmit}
                  >
                    Send
                  </Button>
                </form>
              </Paper>
            </div>
          </Container>
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
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error,
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearErrors,
  forgotPasswordEmail,
  clearAuthMessage
})(ForgotPasswordModal);
