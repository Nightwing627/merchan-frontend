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
import { makeSelectProducts } from "../index/selectors";
import { makeSelectMalls } from "../../malls/index/selectors";
import { setProducts } from "../index/actions";
import { addProductAvartarApi, updateProductApi } from "../index/api";
import { setMalls } from '../../malls/index/actions';

import ProductCategories from "../ProductList/components/Categories";

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

class DetailProductPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      originalProduct: {
        id: "",
        name: "",
        productCode: "",
        shoppingId: "",
        quantity: "",
        period: "",
        location: "",
        price: "",
        techSpects: "",
        description: "",
        profileImage: "",
        dimensions: "",
      },
      updatedProduct: {
        id: "",
        name: "",
        productCode: "",
        shoppingId: "",
        quantity: "",
        period: "",
        location: "",
        price: "",
        description: "",
        profileImage: "",
        dimensions: "",
        techSpects: "",
      },
      id: "",
      product: null,
      errors: {},
    };
  }

  componentDidMount = () => {
    const { id } = this.props.match.params;
    if (id !== this.state.id && this.state.product === null) {
      const { products } = this.props;
      if (products.length !== 0) {
        const filteredProducts = products.filter(
          (product) => product.id === id
        );
        this.setState({
          originalProduct: filteredProducts[0],
          updatedProduct: filteredProducts[0],
          id,
        });
      } else {
        this.props.history.push("/products");
      }
    }
  };

  handleFormChange = (event) => {
    const { updatedProduct: previousProductState } = this.state;
    const updatedProduct = update(previousProductState, {
      [event.target.name]: { $set: event.target.value },
    });
    this.setState({ updatedProduct });
  };

  addProfileImage = async (event) => {
    if (event.target.files.length !== 0) {
      let formData = new FormData();
      formData.append("upload", event.target.files[0]);
      const changedImage = await addProductAvartarApi(formData);
      const updatedProduct = update(this.state.updatedProduct, {
        profileImage: {
          $set: changedImage,
        },
      });
      this.setState({
        updatedProduct,
      });
    }
  };

  updateProduct = async () => {
    if (this.handleValidation()) {
      const {
        updatedProduct: {
          id,
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
      const postBody = {
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
      };
      await updateProductApi(id, postBody);
      const { products, onSetProducts, malls, onSetMalls } = this.props;
      const productIds = products.map((product) => product.id);
      const currentProductIndex = productIds.findIndex(
        (productId) => productId === id
      );
      const updatedProducts = update(products, {
        [currentProductIndex]: { $set: this.state.updatedProduct },
      });
      const updateMall = malls.find((x) => x.id === shoppingId)
      const product = updateMall.products.find((p) => p.id === id)
      if (product) product.quantity = quantity
      //in case update mall
      else {
        updateMall.products.push(this.state.updatedProduct)
        const oldShoppingId = this.oldShoppingId || this.state.originalProduct.shoppingId
        const removeMall = malls.find((x) => x.id === oldShoppingId)
        removeMall.products = removeMall.products.filter((p) => p.id !== id)
        this.oldShoppingId = oldShoppingId
      }
      onSetProducts(updatedProducts);
      onSetMalls(malls)
      this.props.history.push("/products");
    } else {
      alert("Form has errors.");
    }
  };

  handleCancelUpdatedProduct = () => {
    this.props.history.push("/products");
  };

  handleValidation = () => {
    let fields = this.state.updatedProduct;
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

  render () {
    const { classes, malls } = this.props;
    const {
      updatedProduct: {
        name: updatedProductName,
        productCode: updatedProductCode,
        shoppingId: updatedShoppingId,
        quantity: updatedQuantity,
        period: updatedPeriod,
        location: updatedLocation,
        price: updatedPrice,
        techSpects: updatedTechSpects,
        description: updatedDescription,
        profileImage: updatedProfileImage,
        dimensions: updatedDimensions,
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
                      src={
                        updatedProfileImage
                          ? updatedProfileImage
                          : toAbsoluteUrl("/media/users/default.jpg")
                      }
                      alt=""
                      className={classes.avatarImg}
                    />
                    <div style={{ paddingLeft: "20px" }}>
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
                          id="detailProductCodetxt"
                          placeholder="Larissa Mendosa"
                          name="productCode"
                          value={updatedProductCode || ""}
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
                          value={updatedShoppingId || ""}
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
                          value={updatedProductName || ""}
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
                            min={0}
                            value={updatedQuantity || 0}
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
                            value={updatedPeriod || ""}
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
                            value={updatedPrice || 0}
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
                          value={updatedDimensions || ""}
                          onChange={this.handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          placeholder="Estacionamento G2"
                          value={updatedLocation || ""}
                          onChange={this.handleFormChange}
                        />
                      </Form.Group>
                      <Form.Group>
                        <TextField
                          id="shopping-technical-specification"
                          label="Technical Specifications"
                          multiline
                          variant="outlined"
                          rowsMax="20"
                          name="techSpects"
                          value={updatedTechSpects || ""}
                          onChange={this.handleFormChange}
                          className={classes.textField}
                          margin="normal"
                        />
                      </Form.Group>
                      <Form.Group>
                        <TextField
                          id="shopping-description-text"
                          label="Description"
                          multiline
                          variant="outlined"
                          rowsMax="4"
                          name="description"
                          value={updatedDescription || ""}
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
                    onClick={this.handleCancelUpdatedProduct}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    style={{ float: "right" }}
                    onClick={this.updateProduct}
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

DetailProductPage.propTypes = {
  products: PropTypes.array,
  onSetProducts: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  products: makeSelectProducts(),
  malls: makeSelectMalls(),
});

function dispatchToProps (dispatch) {
  return {
    onSetProducts: (products) => dispatch(setProducts(products)),
    onSetMalls: (malls) => dispatch(setMalls(malls)),
  };
}

const withConnect = connect(mapStateToProps, dispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(DetailProductPage));
