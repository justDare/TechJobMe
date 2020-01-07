import React, { Component } from 'react';

export class Application extends Component {
  render() {
    const { application } = this.props.location.state;
    return <div>{application.name} Profile!</div>;
  }
}

export default Application;
