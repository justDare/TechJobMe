import React, { Component, Fragment } from 'react';
import { NavLink } from 'reactstrap';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { clearApplications } from '../../actions/applicationActions';

export class Logout extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    clearApplications: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
  };

  logout = () => {
    this.props.clearApplications();
    this.props.logout();
  };

  render() {
    const { isAuthenticated } = this.props;

    // If not authenticated, redirect to dashboard
    if (!isAuthenticated) return <Redirect to="/" />;

    return (
      <Fragment>
        <NavLink onClick={this.logout} href="#">
          Logout
        </NavLink>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout, clearApplications })(Logout);
