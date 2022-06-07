/* eslint-disable no-restricted-imports */
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import PropTypes from "prop-types";
import { List, Card, CardContent, Button, Divider } from "@material-ui/core";
import UserRow from "./components/UserRow";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { withStyles } from "@material-ui/core/styles";

import { makeSelectUsers } from "../../../users/index/selectors";

import CreateUserModal from "../../CreateUserModal";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
  },
});

class TeamPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      financialUsers: [],
      legalUsers: [],
      financialCheckedIndex: -1,
      LegalCheckedIndex: -1,
      openCreateNewUserModal: false,
    };
  }

  componentDidMount = async () => {
    const { teamPageState, users } = this.props;
    const { financialId, legalId } = teamPageState;
    const financialUsers = users.filter(
      (user) => user.userType === "Financial"
    );
    const legalUsers = users.filter((user) => user.userType === "Legal");
    this.setState({
      financialUsers,
      legalUsers,
    });
    const financialIds = financialUsers.map((user) => user.id);
    const currentFinancialIndex = financialIds.findIndex(
      (userId) => userId === financialId
    );
    const legalIds = legalUsers.map((user) => user.id);
    const currentLegalIndex = legalIds.findIndex(
      (userId) => userId === legalId
    );
    this.setState({
      financialCheckedIndex: currentFinancialIndex,
      LegalCheckedIndex: currentLegalIndex,
    });
  };

  handleToggle = (e, value, name) => {
    const { handleUserChange } = this.props;
    if (name === "Financial") {
      const { financialUsers: users } = this.state;
      const userIds = users.map((user) => user.id);
      const currentUserIndex = userIds.findIndex((userId) => userId === value);
      this.setState({
        financialCheckedIndex: currentUserIndex,
      });
      handleUserChange("financialId", users[currentUserIndex].id);
    } else {
      const { legalUsers: users } = this.state;
      const userIds = users.map((user) => user.id);
      const currentUserIndex = userIds.findIndex((userId) => userId === value);
      this.setState({
        LegalCheckedIndex: currentUserIndex,
      });
      handleUserChange("legalId", users[currentUserIndex].id);
    }
  };

  mapFiancialRow = () => {
    const { financialUsers } = this.state;
    return financialUsers.map((user, index) => {
      return (
        <UserRow
          checked={index === this.state.financialCheckedIndex ? true : false}
          name="Financial"
          value={user.id}
          user={user}
          key={user.id}
          handleToggle={this.handleToggle}
        />
      );
    });
  };
  mapLegalRow = () => {
    const { legalUsers } = this.state;
    return legalUsers.map((user, index) => {
      return (
        <UserRow
          checked={index === this.state.LegalCheckedIndex ? true : false}
          name="Legal"
          value={user.id}
          user={user}
          key={user.id}
          handleToggle={this.handleToggle}
        />
      );
    });
  };

  handleOpenNewUserModal = () => {
    this.setState({
      openCreateNewUserModal: true,
    });
  };

  onCloseModal = (type) => {
    if (type === "add") {
      const { users } = this.props;
      this.handleFilterUsersByType(users);
    }
    this.setState({
      openCreateNewUserModal: false,
    });
  };

  handleFilterUsersByType = (users) => {
    const financialUsers = users.filter(
      (user) => user.userType === "Financial"
    );
    const legalUsers = users.filter((user) => user.userType === "Legal");
    this.setState({
      financialUsers,
      legalUsers,
    });
  };

  render () {
    const { classes, handleUpdateMall } = this.props;
    const { openCreateNewUserModal } = this.state;
    return (
      <div className="col-md-12" style={{ marginTop: 20 }}>
        <div className="row">
          <div className="col-md-12" style={{ textAlign: "right" }}>
            <Button
              color="primary"
              className={classes.button}
              size="large"
              onClick={(e) => this.handleOpenNewUserModal(e)}
            >
              <AddOutlinedIcon fontSize="default" />
              Add User
            </Button>
          </div>
        </div>
        <CreateUserModal
          open={openCreateNewUserModal}
          onCloseModal={this.onCloseModal}
        />
        <div className="row">
          <div className="col-md-6">
            <div className={classes.cardTitle}>
              <span>Financial</span>
            </div>
            <Card>
              <CardContent style={{ backgroundColor: '#F8F9FB' }}>
                <List
                  className={classes.root}
                  style={{ backgroundColor: '#F8F9FB' }}
                >
                  {this.mapFiancialRow()}
                </List>
              </CardContent>
            </Card>
          </div>
          <div className="col-md-6">
            <div className={classes.cardTitle}>
              <span>Legal</span>
            </div>
            <Card>
              <CardContent style={{ backgroundColor: '#F8F9FB' }}>
                <List style={{ backgroundColor: '#F8F9FB' }} className={classes.root}>{this.mapLegalRow()}</List>
              </CardContent>
            </Card>
          </div>
        </div>
        <Divider />
        <div
          className="row"
          style={{ padding: 20, float: "right", marginRight: 20 }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateMall}
          >
            Save
          </Button>
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
    );
  }
}

TeamPage.propTypes = {
  handleUserChange: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

const withConnect = connect(mapStateToProps, null);

export default withStyles(useStyles)(compose(withConnect)(TeamPage));
