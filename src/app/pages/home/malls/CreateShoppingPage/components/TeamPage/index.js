/* eslint-disable no-restricted-imports */
import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
import PropTypes from "prop-types";
import { List, Card, CardContent, Button } from "@material-ui/core";
import UserRow from "./components/UserRow";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import { withStyles } from "@material-ui/core/styles";

import { makeSelectUsers } from "../../../../users/index/selectors";

import CreateUserModal from "../../../CreateUserModal";

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
  constructor(props) {
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
    const { users } = this.props;
    this.handleFilterUsersByType(users);
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

  render() {
    const { classes } = this.props;
    const { openCreateNewUserModal } = this.state;
    return (
      <React.Fragment>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-12">
              <span style={{ fontSize: 18, fontWeight: "bold" }}>Team</span>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <span>This page allows the administrator</span>
            </div>
            <div className="col-md-4" style={{ textAlign: "right" }}>
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
          <div className="row">
            <div className="col-md-6">
              <div className={classes.cardTitle}>
                <span>Financial</span>
              </div>
              <Card>
                <CardContent>
                  <List className={classes.root}>{this.mapFiancialRow()}</List>
                </CardContent>
              </Card>
            </div>
            <div className="col-md-6">
              <div className={classes.cardTitle}>
                <span>Legal</span>
              </div>
              <Card>
                <CardContent>
                  <List className={classes.root}>{this.mapLegalRow()}</List>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <CreateUserModal
          open={openCreateNewUserModal}
          onCloseModal={this.onCloseModal}
        />
      </React.Fragment>
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
