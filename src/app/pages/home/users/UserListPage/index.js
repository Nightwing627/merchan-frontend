import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Pagination from "@material-ui/lab/Pagination";
import UserCard from "../components/UserCard";
// eslint-disable-next-line no-restricted-imports
import { withStyles } from "@material-ui/core/styles";
// import { Button, Fab } from "@material-ui/core";
import {
  InputBase,
  IconButton,
  Fab,
  Radio,
  FormControlLabel,
} from "@material-ui/core";

import { fetchAllUsersApi } from "../index/api";

import { makeSelectUsers } from "../index/selectors";
import { setUsers } from "../index/actions";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";

// import SearchField from "react-search-field";

const useStyles = () => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
  },
  activeButton: {
    color: "#3F51B5",
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
});
class UserListPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      filteredUsers: [],
      currentUsers: [],
      totalPageNumber: 0,
      activeType: "todo",
      currentPageNumber: 1,
      searchText: "",
    };
  }

  componentDidMount = async () => {
    const { users, onSetUsers } = this.props;
    if (users.length === 0) {
      const users = await fetchAllUsersApi();
      onSetUsers(users);
    } else {
      this.handlePagination(users);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const filteredUsers = nextProps.users;
    this.handlePagination(filteredUsers);
  };

  handlePagination = (filteredUsers) => {
    const totalPageNumber = this.getTotalPageNumber(filteredUsers);
    this.setState({
      totalPageNumber,
    });
    const currentUsers = this.getCurrentPageUsersByPageNumber(1, filteredUsers);
    this.setState({
      filteredUsers,
      currentUsers,
    });
  };

  getTotalPageNumber = (filteredUsers) => {
    let delta = 0;
    const mod = filteredUsers.length % 16;
    if (mod !== 0) {
      delta = delta + 1;
    }
    const totalPageNumber = Math.floor(filteredUsers.length / 16) + delta;
    return totalPageNumber;
  };

  filterUsersByType = (e, type) => {
    let currentUsers = [];
    let totalPageNumber = 0;
    if (type === "todo") {
      this.setState({
        activeType: type,
        filteredUsers: this.props.users,
        searchText: "",
      });
      currentUsers = this.getCurrentPageUsersByPageNumber(1, this.props.users);
      totalPageNumber = this.getTotalPageNumber(this.props.users);
    } else {
      const filteredUsers = this.props.users.filter(
        (user) => user.userType === type
      );
      this.setState({
        activeType: type,
        filteredUsers,
        searchText: "",
      });
      currentUsers = this.getCurrentPageUsersByPageNumber(1, filteredUsers);
      totalPageNumber = this.getTotalPageNumber(filteredUsers);
    }
    this.setState({ currentUsers, totalPageNumber, currentPageNumber: 1 });
  };

  onChangeSearchName = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onChangePageNumber = (e, page) => {
    const currentUsers = this.getCurrentPageUsersByPageNumber(
      page,
      this.state.filteredUsers
    );
    this.setState({
      currentUsers,
      currentPageNumber: page,
    });
  };
  getCurrentPageUsersByPageNumber = (pageNumber, totalUsers) => {
    const currentUsers = totalUsers.filter(
      (user, index) => index >= (pageNumber - 1) * 16 && index < pageNumber * 16
    );
    return currentUsers;
  };
  mapUserCards = () => {
    return this.state.currentUsers.map((user) => (
      <UserCard user={user} key={user.id} />
    ));
  };

  createNewUser = () => {
    this.props.history.push("/users/add");
  };

  handleSearchByName = () => {
    const { searchText } = this.state;
    let searchedUsers = this.props.users.filter(
      (user) => user.username && user.username.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    );
    if (searchText.length === 0) searchedUsers = this.props.users
    this.setState({
      filteredUsers: searchedUsers,
      activeType: "",
    });
    this.handlePagination(searchedUsers);
  };

  render () {
    const { classes } = this.props;
    const { activeType, currentPageNumber, searchText } = this.state;
    return (
      <React.Fragment>
        <div
          className="kt-subheader__toolbar"
          style={{ position: "relative", float: "right", marginTop: "-50px" }}
        >
          <div className="kt-subheader__wrapper">
            <FormControlLabel
              value="Broker"
              control={
                <Radio
                  checked={activeType === "todo"}
                  onClick={(e) => this.filterUsersByType(e, "todo")}
                  value="Todo"
                  name="userType"
                  inputProps={{ "aria-label": "Todo" }}
                  color="primary"
                />
              }
              label="Todo"
              labelPlacement="end"
            />
            <FormControlLabel
              value="Broker"
              control={
                <Radio
                  checked={activeType === "Broker"}
                  onClick={(e) => this.filterUsersByType(e, "Broker")}
                  value="Broker"
                  name="userType"
                  inputProps={{ "aria-label": "Broker" }}
                  color="primary"
                />
              }
              label="Broker"
              labelPlacement="end"
            />
            <FormControlLabel
              value="Legal"
              control={
                <Radio
                  checked={activeType === "Legal"}
                  onClick={(e) => this.filterUsersByType(e, "Legal")}
                  value="Legal"
                  name="userType"
                  color="primary"
                  inputProps={{ "aria-label": "Legal" }}
                />
              }
              label="Legal"
              labelPlacement="end"
            />
            <FormControlLabel
              value="emp-radio"
              control={
                <Radio
                  checked={activeType === "Entrepreneur"}
                  onClick={(e) => this.filterUsersByType(e, "Entrepreneur")}
                  value="Entrepreneur"
                  name="userType"
                  color="primary"
                  inputProps={{
                    "aria-label": "Entrepreneur",
                  }}
                />
              }
              label="Entrepreneur"
              labelPlacement="end"
            />
            <FormControlLabel
              value="fin-radio"
              control={
                <Radio
                  checked={activeType === "Financial"}
                  onClick={(e) => this.filterUsersByType(e, "Financial")}
                  value="Financial"
                  name="userType"
                  color="primary"
                  inputProps={{ "aria-label": "Financial" }}
                />
              }
              label="Financial"
              labelPlacement="end"
            />
            <div
              className={classes.root}
              style={{
                position: "relative",
                float: "right",
                marginLeft: 30,
                backgroundColor: '#EAECF2',
                borderRadius: 4,
                width: 200,
                height: 39
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Search User Names..."
                inputProps={{ "aria-label": "Search Google Maps" }}
                name="searchText"
                value={searchText}
                onChange={(e) => this.onChangeSearchName(e)}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) this.handleSearchByName()
                }}
              />
              <IconButton aria-label="Search" onClick={this.handleSearchByName}>
                <i className="flaticon-search" style={{ color: '#374AFB', fontSize: 16 }}></i>
              </IconButton>
              {/* <SearchField
                placeholder="Search..."
                onChange={(e) =>this.onChange(e)}
                searchText="This is initial search text"
                classNames="test-class"
              /> */}
            </div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 5 }}>
          {this.mapUserCards()}
        </div>
        <div style={{ padding: 10 }}>
          <Pagination
            count={this.state.totalPageNumber}
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
            onChange={this.onChangePageNumber}
            page={currentPageNumber}
          />
        </div>
        <div style={{ float: "right", marginBottom: 30 }}>
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            onClick={this.createNewUser}
          >
            <span style={{ margin: "0 10px" }}>
              New User
              <AddOutlinedIcon fontSize="large" style={{ marginLeft: 10 }} />
            </span>
          </Fab>
        </div>
      </React.Fragment>
    );
  }
}

UserListPage.propTypes = {
  users: PropTypes.array,
};

function mapDispatchToProps (dispatch) {
  return {
    onSetUsers: (users) => dispatch(setUsers(users)),
  };
}

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(UserListPage));
