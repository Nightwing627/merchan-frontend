/* eslint-disable no-restricted-imports */
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withStyles } from "@material-ui/core/styles";
import {
  Fab,
  InputBase,
  IconButton,
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import ProductCategories from "./components/Categories";

import { makeSelectProducts } from "../index/selectors";
import { makeSelectMalls } from "../../malls/index/selectors";
import { setProducts } from "../index/actions";
import { setMalls } from "../../malls/index/actions";
import { fetchAllProductsApi, deleteProductApi } from "../index/api";
import { fetchAllMallsApi } from "../../malls/index/api";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import MerchanDialog from "../../common/Dialog";
import EnhancedTable from "./components/ProductSortingTable";

const styles = () => ({
  root: {
    width: "100%",
  },
  table: {
    minWidth: 700,
  },
  image: {
    borderRadius: 10,
    width: 50,
    height: 50,
  },
  edit: {
    height: 30,
    width: 30,
    margin: 5,
    color: "mediumblue",
    backgroundColor: "lavender",
    border: "solid 5px lavender",
    borderRadius: 5,
    "&:hover": {
      cursor: "pointer",
    },
  },
  delete: {
    height: 30,
    width: 30,
    margin: 5,
    color: "red",
    backgroundColor: "#FBE8E2",
    border: "solid 5px #FBE8E2",
    borderRadius: 5,
    "&:hover": {
      cursor: "pointer",
    },
  },
  cellLabel: {},
  input: {
    marginLeft: 8,
    flex: 1,
  },
});

const headCells = [
  { id: 'image', numeric: false, disablePadding: true, label: '' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Product name' },
  { id: 'productCode', numeric: false, disablePadding: false, label: 'Product code' },
  { id: 'quantity', numeric: false, disablePadding: false, label: 'Quantity' },
  { id: 'period', numeric: false, disablePadding: false, label: 'Period' },
  { id: 'actions', numeric: false, disablePadding: false, label: '' },
];

class ProductListPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      rowsPerPage: 5,
      page: 0,
      openRemoveProductModal: false,
      activeProductId: "",
      searchText: "",
      filteredProducts: [],
      shoppingId: "",
    };
  }

  componentDidMount = async () => {
    const { products, onSetProducts, malls, onSetMalls } = this.props;
    if (products.length === 0) {
      const { products } = await fetchAllProductsApi();
      this.setState({
        filteredProducts: products,
      });
      onSetProducts(products);
    } else {
      this.setState({
        filteredProducts: products,
      });
    }
    if (malls.length === 0) {
      const malls = await fetchAllMallsApi();
      const formattedMalls = malls.reduce((finalArr, currentMall) => {
        const {
          id,
          fantasiaName,
          companyName,
          companyNumber,
          companyPhone,
          address,
          shoppingNumber,
          neighborhood,
          city,
          state,
          partners,
          financialId,
          legalId,
          avartar,
          products
        } = currentMall;
        const newMall = {
          id,
          fantasiaName,
          companyName,
          companyNumber,
          companyPhone,
          address,
          shoppingNumber,
          neighborhood,
          city,
          state,
          partners: partners.map((partner) => JSON.parse(partner)),
          financialId,
          legalId,
          avartar,
          products
        };
        finalArr.push(newMall);
        return finalArr;
      }, []);
      onSetMalls(formattedMalls);
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({
      rowsPerPage: event.target.value,
    });
  };

  createNewProduct = () => {
    this.props.history.push("/products/add");
  };

  openDetailProductPage = (event, productId) => {
    this.props.history.push("/products/" + productId);
  };

  openRemoveDialog (event, value, target, activeProductId) {
    this.setState({
      [target]: value,
      activeProductId,
    });
  };

  handleDialogAction = async (e, action, target) => {
    if (action) {
      if (target === "openRemoveProductModal") {
        const { activeProductId } = this.state;
        const updatedProducts = this.props.products.filter(
          (product) => product.id !== activeProductId
        );
        await deleteProductApi(activeProductId);
        const { onSetProducts, malls, onSetMalls } = this.props;
        onSetProducts(updatedProducts);
        const mall = malls.find((x) => x.products.some((p) => p.id === activeProductId))
        mall.products = mall.products.filter((p) => p.id !== activeProductId)
        onSetProducts(updatedProducts);
        onSetMalls(malls);
        const filteredProducts = this.state.filteredProducts.filter((p) => p.id !== activeProductId)
        this.setState({ filteredProducts: filteredProducts })
      }
    }
    this.setState({
      [target]: false,
    });
  };

  handleSearchByName = () => {
    const { searchText } = this.state;
    const { products } = this.props;
    if (searchText === "") {
      this.setState({
        filteredProducts: products,
      });
    } else {
      const filteredProducts = this.state.filteredProducts.filter(
        (product) => product.name && product.name.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      );
      this.setState({
        filteredProducts,
        searchText: "",
      });
    }
  };

  onChangeSearchName = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeShopping = (event) => {
    const { products } = this.props;
    let filteredProducts = [];
    if (event.target.value === "") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(
        (product) => product.shoppingId === event.target.value
      );
    }
    this.setState({
      [event.target.name]: event.target.value,
      filteredProducts,
    });
  };

  render () {
    const { classes, malls } = this.props;
    const {
      openRemoveProductModal,
      searchText,
      filteredProducts,
      shoppingId,
    } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-3">
            <Form.Group>
              <Form.Label>SHOPPING</Form.Label>
              <Form.Control
                as="select"
                name="shoppingId"
                value={shoppingId || ""}
                onChange={(e) => this.handleChangeShopping(e)}
              >
                <option value="">All Shoppings</option>
                {malls.map((mall) => {
                  return (
                    <option key={mall.id} value={mall.id}>
                      {mall.fantasiaName}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <ProductCategories />
          </div>
          <div className="col-md-9">
            <div
              style={{
                position: "absolute",
                marginLeft: 30,
                backgroundColor: '#EAECF2',
                borderRadius: 4,
                width: 330,
                height: 39,
                top: -55,
                right: 10,
                display: 'inline-flex'
              }}
            >
              <InputBase
                className={classes.input}
                placeholder="Search Product"
                inputProps={{ "aria-label": "Search Google Maps" }}
                name="searchText"
                value={searchText}
                onChange={(e) => this.onChangeSearchName(e)}
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
            <div className={classes.root}>
              <EnhancedTable
                headCells={headCells}
                rows={filteredProducts}
                classes={classes}
                openDetailProductPage={this.openDetailProductPage}
                openRemoveDialog={this.openRemoveDialog.bind(this)}
              />
            </div>
          </div>
        </div>
        <MerchanDialog
          target="openRemoveProductModal"
          open={openRemoveProductModal}
          title="Are you going to remove this Product?"
          description="This Product will be removed"
          handleDialogAction={this.handleDialogAction}
          openRemoveDialog={this.openRemoveDialog}
        />
        <div style={{ float: "right", marginTop: 20, marginBottom: 50 }}>
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            onClick={this.createNewProduct}
          >
            <span style={{ margin: "0 10px" }}>
              New Product
              <AddOutlinedIcon fontSize="large" />
            </span>
          </Fab>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  products: makeSelectProducts(),
  malls: makeSelectMalls(),
});

function mapDispatchToProps (dispatch) {
  return {
    onSetProducts: (products) => dispatch(setProducts(products)),
    onSetMalls: (malls) => dispatch(setMalls(malls)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(compose(withConnect)(ProductListPage));
