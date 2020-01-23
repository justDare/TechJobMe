import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import './Login.scss';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearErrors } from '../../actions/errorActions';

// Material
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';

export class LoginLanding extends Component {
  state = {
    msg: null
  };

  static propTypes = {
    clearErrors: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { msg } = this.props.auth;
    if (msg !== prevProps.auth.msg) {
      // Check for register error
      if (msg === 'Recovery Email Sent!') {
        this.setState({ msg: msg });
      } else {
        this.setState({ msg: null });
      }
    }
  }
  render() {
    return (
      <div>
        <Container>
          <div className="login-main">
            {this.state.msg ? (
              <Alert color="success">{this.state.msg}</Alert>
            ) : null}
            <Paper className="login-card" variant="outlined">
              <LoginModal />
            </Paper>
            <RegisterModal />
          </div>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {
  clearErrors
})(LoginLanding);
