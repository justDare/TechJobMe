import React, { Component } from "react";
import AppNavbar from "../components/AppNavbar";
import {
  Container,
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "reactstrap";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { Link } from "react-router-dom";

export class Application extends Component {
  getFields = () => {
    const application = this.props.application;
    let fields = [];
    for (var field in application) {
      fields.push(
        <ListGroupItem>
          <ListGroupItemHeading>{field}</ListGroupItemHeading>
          <ListGroupItemText>{application[field]}</ListGroupItemText>
        </ListGroupItem>
      );
    }

    return fields;
  };

  render() {
    const application = this.props.application;
    const fields = this.getFields();
    console.log();
    return (
      <div>
        <AppNavbar />
        <Container>
          <Link to="/dashboard">
            <Button className="mb-3" color="primary">
              Back
            </Button>
          </Link>
          <h1 className="mb-3">{application.name} Application</h1>
          <ListGroup>{fields}</ListGroup>
        </Container>
      </div>
    );
  }
}

Application.propTypes = {
  application: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  application: _.find(
    state.application.applications,
    "_id",
    ownProps.match.params._id
  )
});

export default connect(mapStateToProps)(Application);
