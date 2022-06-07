/* eslint-disable no-restricted-imports */
import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withStyles } from "@material-ui/core/styles";
import InputMask from "react-input-mask";
import {
  Radio,
  FormControlLabel,
  FormLabel,
  Paper,
  TextField,
} from "@material-ui/core";
import { Form, InputGroup, FormControl, Col, Button } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { makeSelectUsers } from "../../users/index/selectors";
import { setUsers } from "../../users/index/actions";
import { fetchAddUserProfileImage, addNewUserApi } from "../../users/index/api";

import Portal from "../../common/Portal";
import ClickOffComponentWrapper from "../../common/ClickOffComponentWrapper";

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
    height: 40,
    width: 40,
    margin: 5,
    color: "red",
    backgroundColor: "#FBE8E2",
    border: "solid 5px #FBE8E2",
    borderRadius: 5,
    "&:hover": {
      cursor: "pointer",
    },
  },
});

class CreateUserModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl5: null,
      selectedValue: "a",
      user: {
        username: "",
        password: "",
        email: "",
        profileImage: toAbsoluteUrl("/media/users/default.jpg"),
        userType: "",
        phoneNumber: "",
        commission: 0,
      },
      repassword: "",
      errors: {},
      isBroker: false,
    };
  }

  handleChangeOccupation = (event) => {
    this.setState({
      selectedValue: event.target.value,
    });
  };
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
      const { user: previousUsertate } = this.state;
      const updatedUser = update(previousUsertate, {
        [event.target.name]: { $set: event.target.value },
      });
      this.setState({ user: updatedUser });
    }
  };

  handleDetailsChange = (event, name) => {
    const { user: previousUsertate } = this.state;
    const updatedUser = update(previousUsertate, {
      [name]: { $set: event.target.value },
    });
    this.setState({ user: updatedUser });
  };

  addProfileImage = async (event) => {
    if (event.target.files.length !== 0) {
      let formData = new FormData();
      formData.append("upload", event.target.files[0]);
      const changedImage = await fetchAddUserProfileImage(formData);
      const updatedUser = update(this.state.user, {
        profileImage: {
          $set: changedImage,
        },
      });
      this.setState({
        user: updatedUser,
      });
    }
  };

  handleValidation = () => {
    let fields = this.state.user;
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
    } else {
      let phoneRGEX = /^[(][0-9]{2}[)]([0-9]{4}|[0-9]{5})[-][0-9]{4}$/;
      let phoneResult = phoneRGEX.test(fields["phoneNumber"]);
      if (phoneResult === false) {
        formIsValid = false;
        errors["phoneNumber"] = "PhoneNumber is not valid";
      }
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

  addNewUser = async () => {
    if (this.handleValidation()) {
      const { user } = this.state;
      const newUser = await addNewUserApi(user);
      const { users, onSetUsers, onCloseModal } = this.props;
      let updatedUsers = update(users, {
        $push: [newUser],
      });
      onSetUsers(updatedUsers);
      onCloseModal("add");
    } else {
      alert("Form has errors.");
    }
  };

  onCancelCreateNewUser = () => {
    const { onCloseModal } = this.props;
    onCloseModal("cancel");
  };

  render() {
    const { classes, open, onCloseModal } = this.props;
    const {
      user: {
        username: updatedUserName,
        password: updatedPassWord,
        email: updatedEmail,
        profileImage: updatedProfileImage,
        phoneNumber: updatedPhoneNumber,
        userType: updatedUserType,
        commission: updatedCommission,
      },
      isBroker,
    } = this.state;
    return (
      <Portal selector="#modal">
        {open && (
          <React.Fragment>
            <div className="overlay">
              <ClickOffComponentWrapper onOuterClick={onCloseModal}>
                <div className="row justify-content-center mt-5 pt-5">
                  <div className="col-xl-6 col-lg-8 col-sm-10">
                    <Paper>
                      <div className="kt-section">
                        <span className="kt-section__sub">
                          <div className="row">
                            <div
                              className="col-md-4"
                              style={{ padding: "20px" }}
                            >
                              <img
                                src={updatedProfileImage}
                                alt=""
                                className={classes.avatarImg}
                              />
                              <div style={{ paddingLeft: "20px" }}>
                                <span>
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
                                      border: "solid 2px #5867DD",
                                      color: "#5867DD",
                                      borderRadius: "3px",
                                      padding: "5px 10px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    Change Photo
                                  </span>
                                </label>
                              </div>
                            </div>
                            <div
                              className="col-md-8"
                              style={{ padding: "40px" }}
                            >
                              <Form>
                                <Form.Group>
                                  <Form.Label>Full Name</Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="createUserFullNametxt"
                                    placeholder="Larissa Mendosa"
                                    name="username"
                                    value={updatedUserName}
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
                                    value={updatedEmail}
                                    onChange={this.handleFormChange}
                                  />
                                  <span style={{ color: "red" }}>
                                    {this.state.errors["email"]}
                                  </span>
                                </Form.Group>
                                <Form.Group>
                                  <InputMask
                                    mask={"(99)99999-9999"}
                                    value={updatedPhoneNumber}
                                    disabled={false}
                                    maskChar=" "
                                    onChange={(event) =>
                                      this.handleDetailsChange(
                                        event,
                                        "phoneNumber"
                                      )
                                    }
                                  >
                                    {() => (
                                      <TextField
                                        type="text"
                                        label="Telephone"
                                        variant="outlined"
                                        placeholder="(41)99854-9985"
                                      />
                                    )}
                                  </InputMask>
                                </Form.Group>
                                <span style={{ color: "red" }}>
                                  {this.state.errors["phoneNumber"]}
                                </span>
                                <Form.Group>
                                  <FormLabel component="legend">Role</FormLabel>
                                  <div className="d-flex width-full">
                                    <div>
                                      <FormControlLabel
                                        value="Broker"
                                        control={
                                          <Radio
                                            checked={
                                              updatedUserType === "Broker"
                                            }
                                            onChange={(e) =>
                                              this.handleFormChange(e)
                                            }
                                            value="Broker"
                                            name="userType"
                                            inputProps={{
                                              "aria-label": "Broker",
                                            }}
                                          />
                                        }
                                        label="Broker"
                                        labelPlacement="end"
                                      />
                                      <FormControlLabel
                                        value="Legal"
                                        control={
                                          <Radio
                                            checked={
                                              updatedUserType === "Legal"
                                            }
                                            onChange={(e) =>
                                              this.handleFormChange(e)
                                            }
                                            value="Legal"
                                            name="userType"
                                            inputProps={{
                                              "aria-label": "Legal",
                                            }}
                                          />
                                        }
                                        label="Legal"
                                        labelPlacement="end"
                                      />
                                      <FormControlLabel
                                        value="emp-radio"
                                        control={
                                          <Radio
                                            checked={
                                              updatedUserType === "Entrepreneur"
                                            }
                                            onChange={(e) =>
                                              this.handleFormChange(e)
                                            }
                                            value="Entrepreneur"
                                            name="userType"
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
                                            checked={
                                              updatedUserType === "Financial"
                                            }
                                            onChange={(e) =>
                                              this.handleFormChange(e)
                                            }
                                            value="Financial"
                                            name="userType"
                                            inputProps={{
                                              "aria-label": "Financial",
                                            }}
                                          />
                                        }
                                        label="Financial"
                                        labelPlacement="end"
                                      />
                                    </div>
                                  </div>
                                </Form.Group>
                                {isBroker && (
                                  <Form.Group as={Col} md="4">
                                    <FormLabel component="legend">
                                      Commission:
                                    </FormLabel>
                                    <InputGroup>
                                      <FormControl
                                        placeholder="00"
                                        aria-label="comissao"
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
                                      value={updatedPassWord}
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
                        <div
                          className="kt-section__content"
                          style={{ padding: "20px" }}
                        >
                          <div>
                            <Button
                              variant="outline-danger"
                              style={{ float: "left" }}
                              onClick={this.onCancelCreateNewUser}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="primary"
                              style={{ float: "right" }}
                              onClick={this.addNewUser}
                            >
                              Save
                            </Button>
                          </div>
                          <div style={{ clear: "both" }}></div>
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
              </ClickOffComponentWrapper>
            </div>
          </React.Fragment>
        )}
        <style jsx="true">
          {`
            h4 {
              font-size: 2.28rem;
              line-height: 110%;
              margin: 1.52rem 0 0.912rem 0;
              margin-top: 0;
            }
            .overlay {
              position: fixed;
              background-color: rgba(0, 0, 0, 0.7);
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              z-index: 1999;
            }
            .modal {
              display: block;
              background-color: white;
              position: absolute;
              top: 10%;
              right: 10%;
              left: 10%;
              box-shadow: 0 24px 38px 3px rgba(0, 0, 0, 0.14),
                0 9px 46px 8px rgba(0, 0, 0, 0.12),
                0 11px 15px -7px rgba(0, 0, 0, 0.2);
            }
            .modal-custom {
              opacity: 1;
              visibility: visible;
            }
            .modal-footer {
              background-color: white;
            }
          `}
        </style>
      </Portal>
    );
  }
}

CreateUserModal.propTypes = {
  users: PropTypes.array,
  onSetUsers: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
});

function dispatchToProps(dispatch) {
  return {
    onSetUsers: (users) => dispatch(setUsers(users)),
  };
}

const withConnect = connect(mapStateToProps, dispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(CreateUserModal));
