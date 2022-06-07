/* eslint-disable no-restricted-imports */
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CardMedia,
  CardActions,
  Button,
  Fab,
  Typography,
} from "@material-ui/core";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import MerchanDialog from "../../common/Dialog";

import { makeSelectMalls, makeSelectPartners } from "../index/selectors";
import { makeSelectProducts } from "../../products/index/selectors";
import { setMalls, setPartners } from "../index/actions";
import {
  fetchAllMallsApi,
  fetchAllPartnersApi,
  deleteMallApi,
} from "../index/api";

import { fetchAllProductsApi } from "../../products/index/api";

import { setProducts } from "../../products/index/actions";

const useStyles = () => ({
  card: {
    marginTop: 20,
    padding: 15
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 100,
    margin: 10,
    borderRadius: 5,
  },
});

class ShoppingListPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      malls: [],
      openRemoveShoppingModal: false,
      activeShoppingId: "",
    };
  }

  componentDidMount = async () => {
    const { malls, partners, onSetMalls, onSetPartners } = this.props;
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
    if (partners.length === 0) {
      const partners = await fetchAllPartnersApi();
      onSetPartners(partners);
    }
  };

  getProductsAmountByMallId = async (mallId) => {
    const { products } = this.props;
    if (products.length === 0) {
      const { products } = await fetchAllProductsApi();
      const filteredProducts = products.filter(
        (product) => product.shoppingId === mallId
      );
      console.log("filteredProducts:", filteredProducts);
      // onSetProducts(products);
      return 33;
    } else {
      const filteredProducts = products.filter(
        (product) => product.shoppingId === mallId
      );
      console.log("filteredProducts:", filteredProducts);
      return 44;
    }
  };

  openRemoveDialog = (event, value, target, activeShoppingId) => {
    this.setState({
      [target]: value,
      activeShoppingId,
    });
  };

  handleDialogAction = async (e, action, target) => {
    if (action) {
      if (target === "openRemoveShoppingModal") {
        const { activeShoppingId } = this.state;
        const { malls } = this.props;
        const mallIds = malls.map((mall) => mall.id);
        const currentMallIndex = mallIds.findIndex(
          (mallId) => mallId === activeShoppingId
        );
        const currentMall = malls[currentMallIndex];
        if (currentMall.partners.length === 0) {
          const updatedMalls = this.props.malls.filter(
            (mall) => mall.id !== activeShoppingId
          );
          await deleteMallApi(activeShoppingId);
          const { onSetMalls } = this.props;
          onSetMalls(updatedMalls);
        }
      }
    }
    this.setState({
      [target]: false,
    });
  };

  createNewShopping = () => {
    this.props.history.push("/malls/add");
  };

  openDetailMall = (e, mallId) => {
    this.props.history.push("/malls/" + mallId);
  };

  render () {
    const { classes } = this.props;
    const { openRemoveShoppingModal } = this.state;
    const { malls } = this.props;
    return (
      <React.Fragment>
        <div className="row">
          {malls.map((mall) => {
            const productQuantitys = mall.products && mall.products.length && mall.products.map(x => Number(x.quantity))
            const productAmounts = productQuantitys && productQuantitys.reduce(function (a, b) {
              return a + b
            }, 0)
            return (
              <div className="col-md-4 align-self-stretch" key={mall.id}>
                <Card className={classes.card}>
                  <CardHeader
                    action={
                      <IconButton
                        aria-label="Settings"
                        onClick={(e) =>
                          this.openRemoveDialog(
                            e,
                            true,
                            "openRemoveShoppingModal",
                            mall.id
                          )
                        }
                        style={{ position: 'absolute', right: 20, top: 20 }}
                      >
                        <MoreHorizIcon />
                      </IconButton>
                    }
                    style={{ padding: "10px 15px" }}
                  />
                  <MerchanDialog
                    target="openRemoveShoppingModal"
                    open={openRemoveShoppingModal}
                    title="Are you going to remove this Shopping?"
                    description="This Shopping will be removed"
                    handleDialogAction={this.handleDialogAction}
                    openRemoveDialog={this.openRemoveDialog}
                  />
                  <CardMedia
                    image={
                      mall.avartar === ""
                        ? "https://material-ui.com/static/images/cards/paella.jpg"
                        : mall.avartar
                    }
                    title="Paella dish"
                    style={{
                      margin: 10,
                      float: "left",
                      minWidth: 80,
                      minHeight: 80,
                    }}
                  />
                  <div style={{ padding: "20px 0" }}>
                    <Typography component="h6" variant="h6">
                      {mall.fantasiaName}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {mall.city}-{mall.state}
                    </Typography>
                  </div>
                  <div className={classes.details} style={{ clear: "both" }}>
                    <CardContent className={classes.content}>
                      <div>
                        <span style={{ fontWeight: "bold" }}>Total Sales</span>
                        <span style={{ float: "right" }}>R$249.500</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: "bold" }}>Products</span>
                        <span style={{ float: "right" }}>
                          {productAmounts}
                        </span>
                      </div>
                    </CardContent>
                  </div>
                  <CardActions>
                    <Button
                      size="large"
                      color="primary"
                      fullWidth
                      onClick={(e) => this.openDetailMall(e, mall.id)}
                      style={{ backgroundColor: "#F5F6FF" }}
                    >
                      View Shopping
                    </Button>
                  </CardActions>
                </Card>
              </div>
            );
          })}
        </div>
        <div style={{ float: "right", marginTop: 20, marginBottom: 50 }}>
          <Fab
            variant="extended"
            color="primary"
            aria-label="Add"
            className={classes.margin}
            onClick={this.createNewShopping}
          >
            <span style={{ margin: "0 10px" }}>
              New Shopping
              <AddOutlinedIcon fontSize="large" />
            </span>
          </Fab>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  malls: makeSelectMalls(),
  partners: makeSelectPartners(),
  products: makeSelectProducts(),
});

function mapDispatchToProps (dispatch) {
  return {
    onSetMalls: (malls) => dispatch(setMalls(malls)),
    onSetPartners: (partners) => dispatch(setPartners(partners)),
    onSetProducts: (products) => dispatch(setProducts(products)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(ShoppingListPage));
