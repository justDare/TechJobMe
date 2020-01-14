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
  ListGroupItemText,
  Alert
} from "reactstrap";
import EditModal from "../EditModal";
import { editUser } from "../../actions/authActions";

export class Account extends Component {
  state = {
    modal: false,
    editField: "",
    current: "",
    msg: ""
  };

  static propTypes = {
    user: PropTypes.object,
    editUser: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const user = this.props.user;

    // Alert when edit successful
    if (user !== prevProps.user) {
      for (var field in user) {
        if (user[field] !== prevProps.user[field]) {
          const fieldUI = field.charAt(0).toUpperCase() + field.substring(1);
          this.setState({
            msg: `${fieldUI} updated successfully!`
          });
        }
      }
    }
  }

  toggle = (editField, current) => {
    this.setState({
      modal: !this.state.modal,
      editField: editField,
      current: current
    });
  };

  render() {
    const user = this.props.user;
    const { modal, editField, current } = this.state;

    let editFieldUI = "";
    if (editField)
      editFieldUI = editField.charAt(0).toUpperCase() + editField.substring(1);

    return (
      <div>
        <AppNavbar></AppNavbar>
        <Container>
          <EditModal
            modal={modal}
            editField={editField}
            editFieldUI={editFieldUI}
            current={current}
            toggle={this.toggle}
            editAction={this.props.editUser}
            stateToUpdate={user}
          />
          <Link to="/dashboard">
            <Button className="mb-3" color="primary">
              Back
            </Button>
          </Link>
          <h1 className="mb-3">Account Settings</h1>
          <ListGroup>
            {this.state.msg ? (
              <Alert color="success">{this.state.msg}</Alert>
            ) : null}
            <ListGroupItem key={`${user._id}name`}>
              <ListGroupItemHeading>Name</ListGroupItemHeading>
              <ListGroupItemText>{user.name}</ListGroupItemText>
              <MdEdit onClick={() => this.toggle("name", user.name)} />
            </ListGroupItem>
            <ListGroupItem key={`${user._id}email`}>
              <ListGroupItemHeading>Email</ListGroupItemHeading>
              <ListGroupItemText>{user.email}</ListGroupItemText>
              <MdEdit onClick={() => this.toggle("email", user.email)} />
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

export default connect(mapStateToProps, { editUser })(Account);
