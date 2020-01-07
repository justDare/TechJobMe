import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import { Container } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export class Application extends Component {
  render() {
    const application = this.props.match.params._id;
    console.log(application);
    return (
      <div>
        <AppNavbar />
        <Container>
          {application} Profile!
      </Container>
      </div>

    );
  }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, {})(
  Application
);
