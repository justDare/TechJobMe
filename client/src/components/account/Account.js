import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AppNavbar from "../AppNavbar";
import { Container } from "reactstrap";

export class Account extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    return (
      <div>
        <AppNavbar></AppNavbar>
        <Container>{this.props.user.name}</Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Account);
