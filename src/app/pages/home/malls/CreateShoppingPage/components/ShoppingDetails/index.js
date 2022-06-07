import React from "react";
// eslint-disable-next-line no-restricted-imports
import { withStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../../../../../_metronic/utils/utils";
import InputMask from "react-input-mask";
import { TextField } from "@material-ui/core";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { Form, Col } from "react-bootstrap";
import { addShoppingAvartarApi } from "../../../index/api";
const useStyles = () => ({
  root: {
    display: "flex",
  },
  avatarImg: {
    borderRadius: 10,
    width: 150,
    height: 150,
    margin: 10,
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

class ShoppingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textmask: "(1  )    -    ",
      phone: "",
    };
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      handleDetailsChange,
      shoppingDetailState,
      errors,
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
      <div className="col-md-8">
        <div className="kt-section">
          <span className="kt-section__sub">
            <div className="row" style={{ padding: "0 30px" }}>
              <span style={{ fontSize: 18, fontWeight: "bold" }}>
                ShoppingDetails
              </span>
            </div>
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
                      fontSize="large"
                      color="error"
                      className={classes.delete}
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
                <span style={{ color: "red" }}>{errors["avartar"]}</span>
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
                    <span style={{ color: "red" }}>
                      {errors["fantasiaName"]}
                    </span>
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
                    <span style={{ color: "red" }}>
                      {errors["companyName"]}
                    </span>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>CNPJ</Form.Label>
                    <div>
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
                        {() => <TextField type="text" variant="outlined" />}
                      </InputMask>
                    </div>
                    <span style={{ color: "red" }}>
                      {errors["companyNumber"]}
                    </span>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>CEP</Form.Label>
                    <div>
                      <InputMask
                        mask="99999-999"
                        value={companyPhone}
                        disabled={false}
                        maskChar=" "
                        onChange={(event) =>
                          handleDetailsChange(event, "companyPhone")
                        }
                      >
                        {() => <TextField type="text" variant="outlined" />}
                      </InputMask>
                    </div>
                    <span style={{ color: "red" }}>
                      {errors["companyPhone"]}
                    </span>
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
                    <span style={{ color: "red" }}>{errors["address"]}</span>
                  </Form.Group>
                  <Form.Row>
                    <Form.Group as={Col} md="3">
                      <Form.Label>Number</Form.Label>
                      <Form.Control
                        type="number"
                        name="shoppingNumber"
                        min={0}
                        value={shoppingNumber}
                        onChange={(event) =>
                          handleDetailsChange(event, "shoppingNumber")
                        }
                      />
                      <span style={{ color: "red" }}>
                        {errors["shoppingNumber"]}
                      </span>
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
                      <span style={{ color: "red" }}>
                        {errors["neighborhood"]}
                      </span>
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
                        onChange={(event) => handleDetailsChange(event, "city")}
                      />
                      <span style={{ color: "red" }}>{errors["city"]}</span>
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
                      <span style={{ color: "red" }}>{errors["state"]}</span>
                    </Form.Group>
                  </Form.Row>
                </Form>
              </div>
            </div>
          </span>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(ShoppingDetails);
