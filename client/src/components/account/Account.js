import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AppNavbar from "../AppNavbar";
import { Link } from "react-router-dom";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";

export class Account extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  render() {
    const user = this.props.user;

    return (
      <div>
        <AppNavbar></AppNavbar>
        <Container>
          <Link to="/dashboard">
            <Button className="mb-3" color="primary">
              Back
            </Button>
          </Link>
          <h1 className="mb-3">Account Settings</h1>
          <ListGroup>
            <ListGroupItem key={`${user._id}name`}>
              <ListGroupItemHeading>Name</ListGroupItemHeading>
              <ListGroupItemText>{user.name}</ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem key={`${user._id}email`}>
              <ListGroupItemHeading>Email</ListGroupItemHeading>
              <ListGroupItemText>{user.email}</ListGroupItemText>
            </ListGroupItem>
            <ListGroupItem key={`${user._id}password`}>
              <ListGroupItemHeading>Change Password</ListGroupItemHeading>
            </ListGroupItem>
          </ListGroup>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps)(Account);
