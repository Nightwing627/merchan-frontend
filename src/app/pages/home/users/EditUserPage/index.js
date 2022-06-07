/* eslint-disable no-restricted-imports */
import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withStyles } from "@material-ui/core/styles";
import {
  Radio,
  FormControlLabel,
  FormLabel,
  Paper,
  Menu,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Form, InputGroup, FormControl, Col, Button } from "react-bootstrap";

import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import { setUsers } from "../index/actions";
import { makeSelectUsers } from "../index/selectors";
import {
  fetchAddUserProfileImage,
  updateUserInfoApi,
  deleteUserApi,
} from "../index/api";

import MerchanDialog from "../../common/Dialog";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";

const useStyles = (theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: 0,
  },
  group: {
    margin: theme.spacing(1, 0),
  },
  button: {
    margin: theme.spacing(1),
  },
  avatarImg: {
    borderRadius: 10,
    width: 200,
    height: 200,
    margin: 15,
  },
  input: {
    display: "none",
  },
  delete: {
    height: 30,
    width: 30,
    margin: 8,
    color: "red",
    border: "1px solid #E74141",
    borderRadius: 5,
    "&:hover": {
      cursor: "pointer",
    },
  },
});

const ITEM_HEIGHT = 48;
const options5 = ["Edit", "Delete"];

class EditUserPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      anchorEl5: null,
      selectedValue: "a",
      originalUser: {
        id: "",
        username: "",
        password: "",
        email: "",
        profileImage: "",
        userType: "",
        phoneNumber: "",
        commission: 0,
        createdOn: "",
        updatedOn: "",
      },
      updatedUser: {
        id: "",
        username: "",
        password: "",
        email: "",
        profileImage: "",
        userType: "",
        phoneNumber: "",
        commission: 0,
        createdOn: "",
        updatedOn: "",
      },
      user: null,
      id: "",
      errors: {},
      repassword: "",
      openRemoveUserModal: false,
      openRemoveImageModal: false,
      isBroker: false,
    };
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (id !== this.state.id && this.state.user === null) {
      const { users } = this.props;
      if (users.length !== 0) {
        const filteredUsers = users.filter((user) => user.id === id);
        if (filteredUsers[0].userType === "Broker") {
          this.setState({
            isBroker: true,
          });
        }
        this.setState({
          originalUser: filteredUsers[0],
          updatedUser: filteredUsers[0],
          repassword: filteredUsers[0].password,
          id,
        });
      } else {
        this.props.history.push("/users");
      }
    }
  };

  initialUserMount = () =>
    this.state.originalUser.id !== this.props.match.params.id;
  handleClicKActionMenu = (event) => {
    if (this.state.anchorEl5 !== event.currentTarget) {
      this.setState({ anchorEl5: event.currentTarget }); // eslint-disable-line
    }
  };
  handleCloseActionMenu = () => {
    this.setState({
      anchorEl5: null,
    });
  };

  handleFormChange = (event) => {
    if (event.target.name === "repassword") {
      this.setState({
        repassword: event.target.value,
      });
    } else {
      if (event.target.value === "Broker") {
        this.setState({
          isBroker: true,
        });
      } else {
        if (
          event.target.value === "Legal" ||
          event.target.value === "Entrepreneur" ||
          event.target.value === "Financial"
        ) {
          this.setState({
            isBroker: false,
          });
        }
      }
      const { updatedUser: previousUsertate } = this.state;
      const updatedUser = update(previousUsertate, {
        [event.target.name]: { $set: event.target.value },
      });
      this.setState({ updatedUser });
    }
  };

  addProfileImage = async (event) => {
    if (event.target.files.length !== 0) {
      let formData = new FormData();
      formData.append("upload", event.target.files[0]);
      const changedImage = await fetchAddUserProfileImage(formData);
      const updatedUser = update(this.state.updatedUser, {
        profileImage: {
          $set: changedImage,
        },
      });
      this.setState({
        updatedUser,
      });
    }
  };
  handleValidation = () => {
    let fields = this.state.updatedUser;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Cannot be empty";
    }

    //Email
    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Cannot be empty";
    }

    if (typeof fields["email"] !== "undefined") {
      let lastAtPos = fields["email"].lastIndexOf("@");
      let lastDotPos = fields["email"].lastIndexOf(".");

      if (
        !(
          lastAtPos < lastDotPos &&
          lastAtPos > 0 &&
          fields["email"].indexOf("@@") === -1 &&
          lastDotPos > 2 &&
          fields["email"].length - lastDotPos > 2
        )
      ) {
        formIsValid = false;
        errors["email"] = "Email is not valid";
      }
    }

    //Name
    if (!fields["phoneNumber"]) {
      formIsValid = false;
      errors["phoneNumber"] = "Cannot be empty";
    }
    let phoneRGEX = /^[(][0-9]{2}[)]([0-9]{4}|[0-9]{5})[-][0-9]{4}$/;
    let phoneResult = phoneRGEX.test(fields["phoneNumber"]);
    if (phoneResult === false) {
      formIsValid = false;
      errors["phoneNumber"] = "PhoneNumber is not valid";
    }
    //confirm password
    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Cannot be empty";
    }
    if (this.state.repassword === "") {
      formIsValid = false;
      errors["repassword"] = "Cannot be empty";
    }
    if (this.state.repassword !== fields["password"]) {
      formIsValid = false;
      errors["repassword"] = "Not match password";
    }
    //commission
    if (this.state.isBroker && !fields["commission"]) {
      formIsValid = false;
      errors["commission"] = "Cannot be empty value";
    }
    if (this.state.isBroker) {
      if (
        isNaN(fields["commission"]) ||
        fields["commission"] <= 0 ||
        fields["commission"] > 100
      ) {
        formIsValid = false;
        errors["commission"] = "Invalid Value";
      }
    }
    this.setState({ errors: errors });
    return formIsValid;
  };
  updateUserInfo = async () => {
    if (this.handleValidation()) {
      const currentDateTime = new Date(Date.now()).toLocaleString();
      const {
        updatedUser: {
          id,
          username,
          password,
          email,
          profileImage,
          userType,
          phoneNumber,
          commission,
          createdOn,
        },
      } = this.state;
      const postBody = {
        username,
        password,
        email,
        profileImage,
        userType,
        phoneNumber,
        commission,
        createdOn,
        updatedOn: currentDateTime,
      };
      const { users, onSetUsers } = this.props;
      const userIds = users.map((user) => user.id);
      const currentUserIndex = userIds.findIndex(this.getUserIndexById);
      const updatedUser = {
        id,
        username,
        password,
        email,
        profileImage,
        userType,
        phoneNumber,
        commission,
        createdOn,
        updatedOn: currentDateTime,
      };
      const updatedUsers = update(users, {
        [currentUserIndex]: { $set: updatedUser },
      });
      onSetUsers(updatedUsers);
      await updateUserInfoApi(id, postBody);
      this.props.history.push("/users");
    } else {
      alert("Form has errors.");
    }
  };

  getUserIndexById = (userIds) => userIds === this.props.match.params.id;
  openRemoveDialog = (event, value, target) => {
    this.setState({
      [target]: value,
    });
  };

  handleDialogAction = async (e, action, target) => {
    if (action) {
      if (target === "openRemoveUserModal") {
        const { id } = this.state;
        await deleteUserApi(id);
        const updatedUsers = this.props.users.filter(
          (user) => user.id !== this.state.id
        );
        const { onSetUsers } = this.props;
        onSetUsers(updatedUsers);
        this.props.history.push("/users");
      }
      if (target === "openRemoveImageModal") {
        console.log("RemoveAvatarAction!");
        const updatedUser = update(this.state.updatedUser, {
          profileImage: {
            $set: toAbsoluteUrl("/media/users/default.jpg"),
          },
        });
        this.setState({
          updatedUser,
        });
      }
    }
    this.setState({
      [target]: false,
    });
  };

  render () {
    const { classes } = this.props;
    const {
      originalUser,
      updatedUser: {
        username: updatedUserName,
        password: updatedPassWord,
        email: updatedEmail,
        profileImage: updatedProfileImage,
        phoneNumber: updatedPhoneNumber,
        userType: updatedUserType,
        commission: updatedCommission,
      },
      openRemoveUserModal,
      openRemoveImageModal,
      isBroker,
    } = this.state;
    return (
      <div className="row">
        <div className="col-md-7">
          <Paper>
            <div className="kt-section">
              <span className="kt-section__sub">
                <div className="row">
                  <div className="col-md-4" style={{ padding: "20px" }}>
                    <img
                      src={
                        this.initialUserMount()
                          ? originalUser.profileImage
                          : updatedProfileImage
                      }
                      alt=""
                      className={classes.avatarImg}
                    />
                    <div style={{ paddingLeft: "20px" }}>
                      <span
                        onClick={(e) =>
                          this.openRemoveDialog(e, true, "openRemoveImageModal")
                        }
                      >
                        <DeleteForeverOutlinedIcon
                          className={classes.delete}
                          fontSize="large"
                          color="error"
                        />
                      </span>
                      <input
                        accept="image/*"
                        className={classes.input}
                        id="icon-button-file"
                        type="file"
                        onChange={(e) => this.addProfileImage(e)}
                      />
                      <label htmlFor="icon-button-file">
                        <span
                          style={{
                            border: "solid 1px #374AFB",
                            color: "#5867DD",
                            borderRadius: 4,
                            padding: "5px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Change Photo
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-8" style={{ padding: "40px" }}>
                    <Form>
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          id="editUserFullNametxt"
                          placeholder="Larissa Mendosa"
                          name="username"
                          value={
                            this.initialUserMount()
                              ? originalUser.username
                              : updatedUserName
                          }
                          onChange={this.handleFormChange}
                        />
                        <span style={{ color: "red" }}>
                          {this.state.errors["username"]}
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="larissa@taclashopping.com.br"
                          value={
                            this.initialUserMount()
                              ? originalUser.email
                              : updatedEmail
                          }
                          onChange={this.handleFormChange}
                        />
                        <span style={{ color: "red" }}>
                          {this.state.errors["email"]}
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control
                          type="text"
                          name="phoneNumber"
                          placeholder="(99)99999-9985"
                          value={
                            this.initialUserMount()
                              ? originalUser.phoneNumber
                              : updatedPhoneNumber
                          }
                          onChange={this.handleFormChange}
                        />
                        <span style={{ color: "red" }}>
                          {this.state.errors["phoneNumber"]}
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <FormLabel component="legend">Role</FormLabel>
                        <div className="d-flex width-full">
                          <div>
                            <FormControlLabel
                              value="Broker"
                              control={
                                <Radio
                                  checked={updatedUserType === "Broker"}
                                  onChange={(e) => this.handleFormChange(e)}
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
                                  checked={updatedUserType === "Legal"}
                                  onChange={(e) => this.handleFormChange(e)}
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
                                  checked={updatedUserType === "Entrepreneur"}
                                  onChange={(e) => this.handleFormChange(e)}
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
                                  checked={updatedUserType === "Financial"}
                                  onChange={(e) => this.handleFormChange(e)}
                                  value="Financial"
                                  name="userType"
                                  color="primary"
                                  inputProps={{ "aria-label": "Financial" }}
                                />
                              }
                              label="Financial"
                              labelPlacement="end"
                            />
                          </div>
                        </div>
                      </Form.Group>
                      {isBroker && (
                        <Form.Group
                          as={Col}
                          md="4"
                          style={{
                            marginBottom: "1rem !important",
                            paddingLeft: 0,
                          }}
                        >
                          <FormLabel component="legend">Commission:</FormLabel>
                          <InputGroup>
                            <FormControl
                              placeholder="00"
                              aria-label="Commission"
                              aria-describedby="basic-addon1"
                              type="number"
                              name="commission"
                              value={updatedCommission}
                              onChange={this.handleFormChange}
                            />
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                %
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                          </InputGroup>
                          <span style={{ color: "red" }}>
                            {this.state.errors["commission"]}
                          </span>
                        </Form.Group>
                      )}
                      <Form.Row>
                        <Form.Group as={Col}>
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={
                              this.initialUserMount()
                                ? originalUser.password
                                : updatedPassWord
                            }
                            onChange={this.handleFormChange}
                          />
                          <span style={{ color: "red" }}>
                            {this.state.errors["password"]}
                          </span>
                        </Form.Group>

                        <Form.Group as={Col}>
                          <Form.Label>Repeat Password</Form.Label>
                          <Form.Control
                            type="password"
                            name="repassword"
                            placeholder="Reenter password"
                            value={this.state.repassword}
                            onChange={this.handleFormChange}
                          />
                          <span style={{ color: "red" }}>
                            {this.state.errors["repassword"]}
                          </span>
                        </Form.Group>
                      </Form.Row>
                    </Form>
                  </div>
                </div>
              </span>
              <div className="kt-separator kt-separator--dashed"></div>
              <div className="kt-section__content" style={{ padding: "20px" }}>
                <div>
                  <Button
                    variant="outline-danger"
                    style={{ float: "left" }}
                    onClick={(e) =>
                      this.openRemoveDialog(e, true, "openRemoveUserModal")
                    }
                  >
                    Delete
                  </Button>
                  <Button
                    variant="primary"
                    style={{ float: "right" }}
                    onClick={this.updateUserInfo}
                  >
                    Save
                  </Button>
                  <MerchanDialog
                    target="openRemoveUserModal"
                    open={openRemoveUserModal}
                    title="Are you going to remove this user?"
                    description="This user will be removed"
                    handleDialogAction={this.handleDialogAction}
                    openRemoveDialog={this.openRemoveDialog}
                  />
                  <MerchanDialog
                    target="openRemoveImageModal"
                    open={openRemoveImageModal}
                    title="Are you going to remove this image?"
                    description="This image will be removed"
                    handleDialogAction={this.handleDialogAction}
                    openRemoveDialog={this.openRemoveDialog}
                  />
                </div>
                <div style={{ clear: "both" }}></div>
              </div>
            </div>
          </Paper>
        </div>

        <div className="col-md-5">
          <Paper>
            <Typography
              style={{ padding: "20px", color: "black", fontSize: 18, borderBottom: '1px solid rgba(224, 224, 224, 1)' }}
            >
              Interactions
            </Typography>
            <div style={{padding: '0 10px'}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[0, 1, 2, 3, 4].map((row) => (
                    <TableRow key={row}>
                      <TableCell component="th" scope="row">
                        {row}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <IconButton
                          aria-label="More"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={(e) => this.handleClicKActionMenu(e)}
                        >
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                      <Menu
                        id="long-menu"
                        anchorEl={this.state.anchorEl5}
                        keepMounted
                        open={Boolean(this.state.anchorEl5)}
                        onClose={this.handleCloseActionMenu}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: 100,
                          },
                        }}
                      >
                        {options5.map((option) => (
                          <MenuItem key={option} selected={option === "Pyxis"}>
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Paper>
        </div>
      </div>
    );
  }
}

EditUserPage.propTypes = {
  users: PropTypes.array,
  onSetUsers: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

function dispatchToProps (dispatch) {
  return {
    onSetUsers: (users) => dispatch(setUsers(users)),
  };
}

const withConnect = connect(mapStateToProps, dispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(EditUserPage));
