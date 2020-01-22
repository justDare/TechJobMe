import React, { Component } from 'react';
import {
  Alert,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  validatePasswordResetToken,
  forgotPasswordEmail,
  updatePasswordViaEmail
} from '../../actions/authActions';
import { Redirect } from 'react-router-dom';

export class ResetPassword extends Component {
  state = {
    password: '',
    passwordCheck: '',
    email: '',
    error: false,
    loading: true
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
      }
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    const { password, passwordCheck } = this.state;

    if (password !== passwordCheck) {
      this.setState({
        msg: 'Passwords do not match.'
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
      return <div>Loading...</div>;
    } else if (error) {
      return <div>Error</div>;
    } else {
      return (
        <div>
          <Container>
            <h1>Reset password</h1>
            {this.state.msg ? (
              <Alert color="danger">{this.state.msg}</Alert>
            ) : null}
            <Form onSubmit={this.onSubmit}>
              <FormGroup>
                <Label for="name">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="mb-3"
                  onChange={this.onChange}
                  required
                />
                <Label for="name">Re-Type Password</Label>
                <Input
                  type="password"
                  name="passwordCheck"
                  id="passwordCheck"
                  placeholder="Re-Type Password"
                  className="mb-3"
                  onChange={this.onChange}
                  required
                />
                <Button color="dark" style={{ marginTop: '2rem' }} block>
                  Reset Password
                </Button>
              </FormGroup>
            </Form>
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
