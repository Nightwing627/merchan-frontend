/* eslint-disable no-restricted-imports */
import React from "react";
import { toAbsoluteUrl } from "../../../../../../_metronic/utils/utils";
import { withStyles } from "@material-ui/core/styles";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { Form, Col } from "react-bootstrap";
import { Paper, Button, Divider, TextField } from "@material-ui/core";
import InputMask from "react-input-mask";
import { addShoppingAvartarApi } from "../../index/api";

const useStyles = () => ({
  root: {
    display: "flex",
  },
  avatarImg: {
    borderRadius: 10,
    width: 176,
    height: 176,
    margin: 10,
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
class ShoppingDetail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }
  addShoppingAvartar = async (event) => {
    if (event.target.files.length !== 0) {
      let formData = new FormData();
      formData.append("upload", event.target.files[0]);
      const changedImage = await addShoppingAvartarApi(formData);
      const { handleChangeShoppingAvartar } = this.props;
      handleChangeShoppingAvartar(changedImage);
    }
  };
  render () {
    const {
      classes,
      handleDetailsChange,
      shoppingDetailState,
      handleUpdateMall,
      handleCompanyNumberChange
    } = this.props;
    const {
      fantasiaName = "",
      companyName = "",
      companyNumber = "",
      companyPhone = "",
      address = "",
      shoppingNumber = 0,
      neighborhood = "",
      city = "",
      state = "",
      avartar = "",
    } = shoppingDetailState;
    return (
      <Paper>
        <div className="col-md-12">
          <div className="kt-section">
            <span className="kt-section__sub">
              <div className="row">
                <div className="col-md-4" style={{ padding: "10px 20px" }}>
                  <img
                    src={
                      avartar === ""
                        ? toAbsoluteUrl("/media/users/default.jpg")
                        : avartar
                    }
                    alt=""
                    className={classes.avatarImg}
                  />
                  <div>
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
                      onChange={(e) => this.addShoppingAvartar(e)}
                    />
                    <label htmlFor="icon-button-file">
                      <span
                        style={{
                          border: "solid 1px #374AFB",
                          color: "#5867DD",
                          borderRadius: "4px",
                          padding: "5px 10px",
                          cursor: "pointer",
                        }}
                      >
                        Change Photo
                      </span>
                    </label>
                  </div>
                </div>
                <div className="col-md-8" style={{ padding: "10px 40px" }}>
                  <Form>
                    <Form.Group>
                      <Form.Label>Fantasia Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Shopping Palladium"
                        name="fantasiaName"
                        value={fantasiaName}
                        onChange={(event) =>
                          handleDetailsChange(event, "fantasiaName")
                        }
                      />
                      {/* <span style={{ color: "red" }}>
                  {this.state.errors["username"]}
                </span> */}
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>CompanyName</Form.Label>
                      <Form.Control
                        type="text"
                        name="companyName"
                        placeholder="Shopping Palladium Tacla LTDA"
                        value={companyName}
                        onChange={(event) =>
                          handleDetailsChange(event, "companyName")
                        }
                      />
                      {/* <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span> */}
                    </Form.Group>
                    <Form.Group>
                      <InputMask
                        mask="99.999.999/9999-99"
                        value={companyNumber}
                        disabled={false}
                        maskChar=" "
                        onChange={(event) =>
                          handleDetailsChange(event, "companyNumber")
                        }
                        onBlur={(e) => handleCompanyNumberChange(e)}
                      >
                        {() => (
                          <TextField
                            type="text"
                            label="CNPJ"
                            variant="outlined"
                            placeholder="67.605.166/0001-02"
                          />
                        )}
                      </InputMask>
                    </Form.Group>
                    <Form.Group>
                      <InputMask
                        mask="99999-999"
                        value={companyPhone}
                        disabled={false}
                        maskChar=" "
                        onChange={(event) =>
                          handleDetailsChange(event, "companyPhone")
                        }
                      >
                        {() => (
                          <TextField
                            type="text"
                            label="CEP"
                            variant="outlined"
                            placeholder="99999-999"
                          />
                        )}
                      </InputMask>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="AV.Press.Kennedy"
                        value={address}
                        onChange={(event) =>
                          handleDetailsChange(event, "address")
                        }
                      />
                      {/* <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span> */}
                    </Form.Group>
                    <Form.Row>
                      <Form.Group as={Col} md="3">
                        <Form.Label>Number</Form.Label>
                        <Form.Control
                          type="number"
                          name="shoppingNumber"
                          placeholder="4121"
                          value={shoppingNumber}
                          onChange={(event) =>
                            handleDetailsChange(event, "shoppingNumber")
                          }
                        />
                        {/* <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span> */}
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md="9"
                      >
                        <Form.Label>Neighborhood</Form.Label>
                        <Form.Control
                          type="text"
                          name="neighborhood"
                          placeholder="Partao"
                          value={neighborhood}
                          onChange={(event) =>
                            handleDetailsChange(event, "neighborhood")
                          }
                        />
                        {/* <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span> */}
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col}>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          placeholder="Curitiba"
                          value={city}
                          onChange={(event) =>
                            handleDetailsChange(event, "city")
                          }
                        />
                        {/* <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span> */}
                      </Form.Group>
                      <Form.Group as={Col}>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          type="text"
                          name="state"
                          placeholder="Parana"
                          value={state}
                          onChange={(event) =>
                            handleDetailsChange(event, "state")
                          }
                        />
                        {/* <span style={{ color: "red" }}>
                  {this.state.errors["email"]}
                </span> */}
                      </Form.Group>
                    </Form.Row>
                  </Form>
                </div>
              </div>
            </span>
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
      </Paper>
    );
  }
}

export default withStyles(useStyles)(ShoppingDetail);
