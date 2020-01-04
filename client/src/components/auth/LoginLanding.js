import React, { Component } from 'react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import './login.css';

export class LoginLanding extends Component {
  render() {
    return (
      <div className="login-card">
        <LoginModal />
        <RegisterModal />
      </div>
    );
  }
}

export default LoginLanding;
