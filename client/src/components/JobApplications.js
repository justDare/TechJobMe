import React, { Component } from 'react';
import { ListGroup, ListGroupItem, Button } from 'reactstrap';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import {
  getApplications,
  deleteApplication
} from '../actions/applicationActions';
import PropTypes from 'prop-types';

class JobApplications extends Component {
  state = {
    applicationsLoaded: false
  };

  componentDidMount() {
    const user = this.props.auth.user;
    if (user) this.props.getApplications(user._id);
  }

  onDeleteClick = id => {
    this.props.deleteApplication(id);
  };

  render() {
    const { applications } = this.props.application;

    return (
      <ListGroup>
        <TransitionGroup className="job-applications">
          {applications.map(({ _id, name }) => (
            <CSSTransition key={_id} timeout={500} classNames="fade">
              <ListGroupItem>
                <Button
                  className="remove-btn"
                  color="danger"
                  size="small"
                  onClick={this.onDeleteClick.bind(this, _id)}
                >
                  &times;
                </Button>
                {name}
              </ListGroupItem>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ListGroup>
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
