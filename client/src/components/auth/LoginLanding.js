import React, { Component } from 'react';
import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';

export class LoginLanding extends Component {
  render() {
    return (
      <div>
        <LoginModal />
        <RegisterModal />
      </div>
    );
  }
}

export default LoginLanding;
