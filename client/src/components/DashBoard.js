import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import JobApplications from '../components/JobApplications';
import ApplicationModal from '../components/ApplicationModal';
import { Container, Button, Alert } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  deleteAllApplications,
  clearApplications
} from '../actions/applicationActions';
import PromptModal from './PromptModal';
import store from '../store';
import { loadUser, logout } from '../actions/authActions';
import { Route, Switch, Link } from 'react-router-dom';
import Account from './account/Account';
import Application from './Application';
import './Dashboard.scss';

// Material
import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import HomeTwoToneIcon from '@material-ui/icons/HomeTwoTone';
import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';
import ExitToAppTwoToneIcon from '@material-ui/icons/ExitToAppTwoTone';
import MenuIcon from '@material-ui/icons/Menu';

export class DashBoard extends Component {
  state = {
    promptModal: false,
    msg: null,
    mobileOpen: false
  };

  static propTypes = {
    application: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    deleteAllApplications: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    clearApplications: PropTypes.func.isRequired
  };

  componentDidMount() {
    store.dispatch(loadUser());
  }

  componentDidUpdate(prevProps) {
    const application = this.props.application;

    // Alert when edit successful
    if (application !== prevProps.application) {
      this.setState({
        msg: application.msg
      });
      if (
        application.msg === 'All applications deleted successfully!' &&
        this.state.promptModal
      )
        this.togglePrompt();
    }
  }

  logout = () => {
    this.props.clearApplications();
    this.props.logout();
  };

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  };

  deleteAllApplications = () => {
    this.props.deleteAllApplications(this.props.user._id);
  };

  togglePrompt = () => {
    this.setState({
      promptModal: !this.state.promptModal
    });
  };

  getDrawer = () => {
    return (
      <div>
        <Divider />
        <List>
          <ApplicationModal />
          <Link to="/dashboard">
            <ListItem button>
              <ListItemIcon>
                <HomeTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>
          <Link to="/dashboard/account">
            <ListItem button>
              <ListItemIcon>
                <AccountCircleTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={this.logout} href="#">
            <ListItemIcon>
              <ExitToAppTwoToneIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    );
  };

  render() {
    const drawer = this.getDrawer();
    const path = this.props.match;

    return (
      <div className="d-flex">
        {/* <AppNavbar /> */}
        <AppBar position="fixed" className="app-bar">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={this.handleDrawerToggle}
              className=""
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              TechJobMe
            </Typography>
          </Toolbar>
        </AppBar>
        <nav className="side-bar" aria-label="mailbox folders">
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              className="drawer-mobile"
              anchor="left"
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer className="drawer-desktop" variant="permanent" open>
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <Container className="content">
          {this.state.msg ? (
            <Alert color="success">{this.state.msg}</Alert>
          ) : null}
          <Switch>
            <Route exact path="/dashboard">
              <JobApplications />
            </Route>
            <Route exact path="/dashboard/account">
              <Account />
            </Route>
            <Route
              path="/dashboard/application/:_id"
              render={props => <Application {...props} />}
            />
          </Switch>

          {/* <JobApplications /> */}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  application: state.application,
  user: state.auth.user
});

export default connect(mapStateToProps, {
  deleteAllApplications,
  logout,
  clearApplications
})(DashBoard);
