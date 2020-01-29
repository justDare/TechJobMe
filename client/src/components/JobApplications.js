import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import {
  getApplications,
  deleteApplication,
  deleteAllApplications
} from '../actions/applicationActions';
import PropTypes from 'prop-types';
import { formatDateString } from '../utilities/helperFunctions';
import './JobApplications.scss';

// Material
import MaterialTable, { MTableBodyRow } from 'material-table';

class JobApplications extends Component {
  state = {
    columns: [
      { title: 'Name', field: 'name' },
      { title: 'Position', field: 'position' },
      { title: 'Date', field: 'date' },
      { title: 'Stage', field: 'stage' },
      { title: '_id', field: '_id', hidden: true }
    ],
    data: [],
    redirect: 0
  };
  componentDidMount() {
    const user = this.props.auth.user;
    if (user) this.props.getApplications(user._id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.application !== this.props.application) {
      let UIfields = [];

      this.props.application.applications.forEach(function(application) {
        const picked = (({ name, position, date, stage, _id }) => ({
          name,
          position,
          date,
          stage,
          _id
        }))(application);
        picked.date = formatDateString(picked.date);
        UIfields.push(picked);
      });

      this.setState({ data: UIfields });
    }
  }

  onDeleteClick = (id, e) => {
    e.preventDefault();
    this.props.deleteApplication(id);
  };

  render() {
    const { applications } = this.props.application;

    // sent: "yellow" , reject: "red", phone-screen: "purple" , onsite: "blue" , offer: "green"
    const statusColors = {
      'Application Sent': 'yellow',
      'No Offer': 'red',
      'Phone Screen': 'purple',
      'On-Site': 'blue',
      Offer: 'green'
    };

    if (this.state.redirect) {
      return (
        <Redirect push to={`/dashboard/application/${this.state.redirect}`} />
      );
    }

    return (
      <MaterialTable
        title="Job Applications"
        columns={this.state.columns}
        data={this.state.data}
        onRowClick={(event, rowData) =>
          this.setState({ redirect: rowData._id })
        }
        components={{
          Row: props => <MTableBodyRow app_id={props.data._id} {...props} />
        }}
      />
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

export default connect(mapStateToProps, {
  getApplications,
  deleteApplication,
  deleteAllApplications
})(JobApplications);
