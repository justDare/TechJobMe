import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import AppNavbar from "../AppNavbar";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";
import EditModal from "../EditModal";

export class Account extends Component {
  state = {
    modal: false,
    editField: ""
  };

  static propTypes = {
    user: PropTypes.object
  };

  handleEdit = () => {};

  toggle = editField => {
    this.setState({
      modal: !this.state.modal,
      editField: editField
    });
  };

  render() {
    const user = this.props.user;
    const { modal, editField } = this.state;
    console.log(editField);
    return (
      <div>
        <AppNavbar></AppNavbar>
        <Container>
          <EditModal modal={modal} editField={editField} toggle={this.toggle} />
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
              <MdEdit onClick={() => this.toggle("name")} />
            </ListGroupItem>
            <ListGroupItem key={`${user._id}email`}>
              <ListGroupItemHeading>Email</ListGroupItemHeading>
              <ListGroupItemText>{user.email}</ListGroupItemText>
              <MdEdit onClick={() => this.toggle("email")} />
            </ListGroupItem>
            <ListGroupItem key={`${user._id}password`}>
              <ListGroupItemHeading>Change Password</ListGroupItemHeading>
              <MdEdit onClick={() => this.toggle("password")} />
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
