import React, { Component } from 'react';
import AppNavbar from '../components/AppNavbar';
import JobApplications from '../components/JobApplications';
import ApplicationModal from '../components/ApplicationModal';
import { Container, Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { clearApplications } from '../actions/applicationActions';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import { Alert } from '@material-ui/lab';

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

export class DashBoard extends Component {
  state = {
    promptModal: false,
    msg: null,
    mobileOpen: false,
    backdrop: true,
    snackBar: false
  };

  static propTypes = {
    application: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
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
      // Set applications loading
      if (!this.props.application.loading && this.state.backdrop)
        this.toggleBackdrop();
      if (this.props.application.msg !== prevProps.application.msg) {
        this.setState({ msg: this.props.application.msg });
        this.toggleSnack();
      }
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

  toggleBackdrop = () => {
    this.setState({ backdrop: !this.state.backdrop });
  };

  toggleSnack = () => {
    this.setState({
      snackBar: !this.state.snackBar
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
        <AppBar position="fixed" className="app-bar">
          <Toolbar>
            <Hidden smUp implementation="css">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={this.handleDrawerToggle}
                className=""
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
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
        <Container className="content position-relative">
          <Backdrop
            open={this.state.backdrop}
            className="position-absolute dash-loading"
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Snackbar
            open={this.state.snackBar}
            onClose={this.toggleSnack}
            TransitionComponent={TransitionUp}
            autoHideDuration={6000}
          >
            <Alert
              severity="success"
              variant="filled"
              onClose={this.toggleSnack}
            >
              {this.state.msg}
            </Alert>
          </Snackbar>
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
  logout,
  clearApplications
})(DashBoard);
