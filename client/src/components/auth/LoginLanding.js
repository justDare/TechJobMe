import React, { Component } from 'react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import './Login.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../../actions/errorActions';
import store from '../../store';
import { loadUser } from '../../actions/authActions';

// Material
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

export class LoginLanding extends Component {
  state = {
    msg: null,
    error: false,
    snackBar: false
  };

  static propTypes = {
    clearErrors: PropTypes.func.isRequired
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  componentDidUpdate(prevProps) {
    const msg = this.props.auth.msg;
    const error = this.props.error;

    if (msg !== prevProps.auth.msg) {
      // Check for register error
      if (msg === 'Recovery email sent!') {
        this.setState({ msg: msg });
        this.toggleSnack();
      } else {
        this.setState({ msg: null });
      }
    }

    if (error !== prevProps.error) {
      if (error.id === 'EMAIL_NOT_IN_DB') {
        this.setState({ msg: error.msg });
      }
    }
  }

  toggleSnack = () => {
    this.setState({
      snackBar: !this.state.snackBar
    });
  };

  render() {
    return (
      <div>
        <Container>
          <div className="login-main">
            <Paper className="login-card" variant="outlined">
              <LoginModal />
            </Paper>
            <RegisterModal />
          </div>
        </Container>
        <Snackbar
          open={this.state.snackBar}
          onClose={this.toggleSnack}
          TransitionComponent={TransitionUp}
          autoHideDuration={6000}
        >
          <Alert
            severity={this.state.error ? 'error' : 'success'}
            variant="filled"
            onClose={this.toggleSnack}
          >
            {this.state.msg}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  error: state.error
});

export default connect(mapStateToProps, {
  clearErrors
})(LoginLanding);
