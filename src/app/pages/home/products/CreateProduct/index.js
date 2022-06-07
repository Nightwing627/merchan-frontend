/* eslint-disable no-restricted-imports */
import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withStyles } from "@material-ui/core/styles";
import { Paper, TextField } from "@material-ui/core";
import { Form, Col, Button, InputGroup, FormControl } from "react-bootstrap";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import { makeSelectProducts } from "../index/selectors";
import { makeSelectMalls } from "../../malls/index/selectors";
import { setProducts } from "../index/actions";
import { addProductAvartarApi, addNewProductApi } from "../index/api";

import ProductCategories from "../ProductList/components/Categories";
import { setMalls } from "../../malls/index/actions";

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
  avatarImg: {
    borderRadius: 10,
    width: 200,
    height: 200,
    margin: 15,
  },
  input: {
    display: "none",
  },
});

class CreateProductPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: {
        name: "",
        productCode: "",
        shoppingId: "",
        quantity: 0,
        period: "",
        location: "",
        price: "",
        description: "",
        profileImage: toAbsoluteUrl("/media/users/default.jpg"),
        dimensions: "",
        techSpects: "",
      },
      errors: {},
    };
  }

  handleFormChange = (event) => {
    const { product: previousProductState } = this.state;
    const updatedProduct = update(previousProductState, {
      [event.target.name]: { $set: event.target.value },
    });
    this.setState({ product: updatedProduct });
  };

  handleValidation = () => {
    let fields = this.state.product;
    let errors = {};
    let formIsValid = true;

    //product code validataion
    if (!fields["productCode"]) {
      formIsValid = false;
      errors["productCode"] = "Cannot be empty";
    }
    //Mall validataion
    if (!fields["shoppingId"]) {
      formIsValid = false;
      errors["shoppingId"] = "Cannot be empty";
    }
    //product name validataion
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Cannot be empty";
    }
    //period validataion
    if (!fields["period"]) {
      formIsValid = false;
      errors["period"] = "Cannot be empty";
    }
    //price validataion
    if (!fields["price"]) {
      formIsValid = false;
      errors["price"] = "Cannot be empty";
    }

    if (isNaN(fields["price"]) || fields["price"] <= 0) {
      formIsValid = false;
      errors["price"] = "Invalid Value";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };

  handleChangeAvartar = async (event) => {
    if (event.target.files.length !== 0) {
      let formData = new FormData();
      formData.append("upload", event.target.files[0]);
      const changedImage = await addProductAvartarApi(formData);
      const updatedProduct = update(this.state.product, {
        profileImage: {
          $set: changedImage,
        },
      });
      this.setState({
        product: updatedProduct,
      });
    }
  };

  addNewProduct = async () => {
    if (this.handleValidation()) {
      const { product } = this.state;
      const newProduct = await addNewProductApi(product);
      const { products, onSetProducts, malls, onSetMalls } = this.props;
      let updatedProducts = update(products, {
        $push: [newProduct],
      });
      onSetProducts(updatedProducts);
      const mall = malls.find((x)=>x.id === product.shoppingId)
      mall.products.push(newProduct)
      onSetProducts(updatedProducts);
      onSetMalls(malls);
      this.props.history.push("/products");
    } else {
      alert("Form has errors.");
    }
  };

  handleCancelNewProduct = () => {
    this.props.history.push("/products");
  };

  render() {
    const { classes, malls } = this.props;
    const {
      product: {
        name,
        productCode,
        shoppingId,
        quantity,
        period,
        location,
        price,
        description,
        profileImage,
        dimensions,
        techSpects,
      },
    } = this.state;
    return (
      <div className="row">
        <div className="col-md-8">
          <Paper>
            <div className="kt-section">
              <span className="kt-section__sub">
                <div className="row">
                  <div className="col-md-4" style={{ padding: "20px" }}>
                    <img
                      src={profileImage}
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
                        onChange={(e) => this.handleChangeAvartar(e)}
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
                  <div className="col-md-8" style={{ padding: "40px" }}>
                    <Form>
                      <Form.Group>
                        <Form.Label>Product Code</Form.Label>
                        <Form.Control
                          type="text"
                          id="createProductCodetxt"
                          placeholder="Larissa Mendosa"
                          name="productCode"
                          value={productCode}
                          onChange={this.handleFormChange}
                        />
                        <span style={{ color: "red" }}>
                          {this.state.errors["productCode"]}
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>SHOPPING</Form.Label>
                        <Form.Control
                          as="select"
                          name="shoppingId"
                          value={shoppingId || ""}
                          onChange={(e) => this.handleFormChange(e)}
                        >
                          <option value="" disabled>
                            Choose a Shopping ...
                          </option>

                          {malls.map((mall) => {
                            return (
                              <option key={mall.id} value={mall.id}>
                                {mall.fantasiaName}
                              </option>
                            );
                          })}
                        </Form.Control>
                        <span style={{ color: "red" }}>
                          {this.state.errors["shoppingId"]}
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Hall Eleva"
                          value={name}
                          onChange={this.handleFormChange}
                        />
                        <span style={{ color: "red" }}>
                          {this.state.errors["name"]}
                        </span>
                      </Form.Group>
                      <Form.Row>
                        <Form.Group as={Col}>
                          <Form.Label>Quantity</Form.Label>
                          <Form.Control
                            type="number"
                            name="quantity"
                            value={quantity}
                            min={0}
                            onChange={this.handleFormChange}
                          />
                          <span style={{ color: "red" }}>
                            {this.state.errors["quantity"]}
                          </span>
                        </Form.Group>
                        <Form.Group as={Col}>
                          <Form.Label>Period</Form.Label>
                          <Form.Control
                            type="text"
                            name="period"
                            placeholder="30days"
                            value={period}
                            onChange={this.handleFormChange}
                          />
                          <span style={{ color: "red" }}>
                            {this.state.errors["period"]}
                          </span>
                        </Form.Group>
                      </Form.Row>
                      <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <InputGroup className="mb-3">
                          <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                              R$
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            name="price"
                            placeholder="999.99"
                            value={price}
                            onChange={this.handleFormChange}
                          />
                        </InputGroup>
                        <span style={{ color: "red" }}>
                          {this.state.errors["price"]}
                        </span>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Dimensions</Form.Label>
                        <Form.Control
                          type="text"
                          name="dimensions"
                          placeholder="2.00*6.00m"
                          value={dimensions}
                          onChange={this.handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="Estacionamento G2"
                          value={location}
                          onChange={this.handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group>
                        <TextField
                          id="product-technical-specification-text"
                          label="Technical Specifications"
                          multiline
                          variant="outlined"
                          rowsMax="20"
                          name="techSpects"
                          value={techSpects}
                          onChange={this.handleFormChange}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Form.Group>
                      <Form.Group>
                        <TextField
                          id="product-description-text"
                          label="Description"
                          multiline
                          variant="outlined"
                          rowsMax="4"
                          name="description"
                          value={description}
                          onChange={this.handleFormChange}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Form.Group>
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
                    onClick={this.handleCancelNewProduct}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    style={{ float: "right" }}
                    onClick={this.addNewProduct}
                  >
                    Save
                  </Button>
                </div>
                <div style={{ clear: "both" }}></div>
              </div>
            </div>
          </Paper>
        </div>
        <div className="col-md-4">
          <ProductCategories />
        </div>
      </div>
    );
  }
}

CreateProductPage.propTypes = {
  products: PropTypes.array,
  onSetProducts: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  products: makeSelectProducts(),
  malls: makeSelectMalls(),
});

function dispatchToProps(dispatch) {
  return {
    onSetProducts: (products) => dispatch(setProducts(products)),
    onSetMalls: (malls) => dispatch(setMalls(malls)),
  };
}

const withConnect = connect(mapStateToProps, dispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(CreateProductPage));
