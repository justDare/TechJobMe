import React, { Component } from "react";
import { Row, Col, Button } from "reactstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  getApplications,
  deleteApplication
} from "../actions/applicationActions";
import PropTypes from "prop-types";
import { formatDateString } from "../utilities/helperFunctions";
import "./JobApplications.scss";

class JobApplications extends Component {
  componentDidMount() {
    const user = this.props.auth.user;
    if (user) this.props.getApplications(user._id);
  }

  onDeleteClick = (id, e) => {
    e.preventDefault();
    this.props.deleteApplication(id);
  };

  render() {
    const { applications } = this.props.application;

    // sent: "yellow" , reject: "red", phone-screen: "purple" , onsite: "blue" , offer: "green"
    const statusColors = {
      "Application Sent": "yellow",
      "No Offer": "red",
      "Phone Screen": "purple",
      "On-Site": "blue",
      Offer: "green"
    };

    return (
      <TransitionGroup className="job-applications">
        {applications.map(application => (
          <CSSTransition key={application._id} timeout={500} classNames="fade">
            <Row
              className="application-row position-relative"
              tag={Link}
              to={{
                pathname: `/application/${application._id}`
              }}
            >
              <Col xs="2">
                <Button
                  className="remove-btn"
                  color="danger"
                  size="small"
                  onClick={this.onDeleteClick.bind(this, application._id)}
                >
                  &times;
                </Button>
              </Col>
              <Col xs="3">{application.name}</Col>
              <Col xs="3">{application.position}</Col>
              <Col xs="3">{formatDateString(application.date)}</Col>
              <Col xs="1"></Col>
              <span
                className={`status status-${statusColors[application.stage]}`}
              ></span>
            </Row>
          </CSSTransition>
        ))}
      </TransitionGroup>
    );
  }
}

JobApplications.propTypes = {
  getApplications: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
  user: PropTypes.object,
  auth: PropTypes.object
};

const mapStateToProps = state => ({
  application: state.application,
  auth: state.auth
});

export default connect(mapStateToProps, { getApplications, deleteApplication })(
  JobApplications
);
