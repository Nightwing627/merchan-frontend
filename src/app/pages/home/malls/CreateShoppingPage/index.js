/* eslint-disable no-restricted-imports */
import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import update from "immutability-helper";
import { Stepper, Step, StepLabel, Button, Paper } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import ShoppingDetailPage from "./components/ShoppingDetails";
import PartnerPage from "./components/PartnerPage";
import TeamPage from "./components/TeamPage";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
// Custom stepper imports
import clsx from "clsx";
import StepConnector from "@material-ui/core/StepConnector";
import { addNewShoppingApi, fetchAllPartnersApi } from "../index/api";

import { setMalls, setPartners } from "../index/actions";
import { makeSelectMalls, makeSelectPartners } from "../index/selectors";
import { makeSelectUsers } from "../../users/index/selectors";
import { setUsers } from "../../users/index/actions";
import { fetchAllUsersApi } from "../../users/index/api";

const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
});

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    "& $line": {
      backgroundImage: `url(${toAbsoluteUrl("/media/icons/r_arrow_b.svg")})`,
    },
  },
  completed: {
    "& $line": {
      backgroundImage: `url(${toAbsoluteUrl("/media/icons/r_arrow_b.svg")})`,
    },
  },
  line: {
    height: "20px",
    width: "20px",
    backgroundImage: `url(${toAbsoluteUrl("/media/icons/r_arrow.svg")})`,
    backgroundSize: "contain",
    margin: "0px auto",
    border: 0,
    // backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

// For Boxes and forms and colors
const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 40,
    height: 40,
    display: "flex",
    borderRadius: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  active: {
    backgroundColor: "#1976d2",
    boxShadow: "2px 5px 12px #bbbbbb",
  },
  completed: {
    backgroundColor: "#1976d2",
  },
});

// For Boxes logo or steps numbers
function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: 1,
    2: 2,
    3: 3,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

class CreateShoppingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      steps: [],
      fantasiaName: "",
      companyName: "",
      companyNumber: "",
      companyPhone: "",
      address: "",
      shoppingNumber: 0,
      neighborhood: "",
      city: "",
      state: "",
      avartar: "",
      partners: [],
      financialId: "",
      legalId: "",
      errors: {},
    };
  }

  componentDidMount = async () => {
    const steps = this.getSteps();
    this.setState({
      steps,
    });
    const { users, onSetUsers, partners, onSetPartners } = this.props;
    if (users.length === 0) {
      const users = await fetchAllUsersApi();
      onSetUsers(users);
    }
    if(partners.length === 0) {
      const partners = await fetchAllPartnersApi();
      onSetPartners(partners);
    }
  };
  getSteps = () => {
    return ["DetailShopping", "PartnerPage", "TeamPage"];
  };
  handleNext = () => {
    if (this.handleValidation()) {
      if (this.state.activeStep === 2) {
        this.handlSaveNewShoppiing();
      } else {
        this.setState({
          activeStep: this.state.activeStep + 1,
        });
      }
    } else {
      alert("Form has errors.");
    }
  };

  handleBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    });
  };

  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };

  handleDetailsChange = (event, name) => {
    const value = event.target ? event.target.value : event;
    this.setState({ [name]: value });
  };

  handleUserChange = (name, value) => {
    this.setState({ [name]: value });
  };

  handleChangeShoppingAvartar = (imageURL) => {
    this.setState({
      avartar: imageURL,
    });
  };

  handleChangePartner = (action, newData = null, oldData = null) => {
    const { partners } = this.state;
    switch (action) {
      case "Add":
        const addedPartners = update(partners, {
          $push: [newData],
        });
        this.setState({
          partners: addedPartners,
        });
        break;
      case "Delete":
        const deletedPartners = update(partners, {
          $splice: [[partners.indexOf(oldData), 1]],
        });
        this.setState({
          partners: deletedPartners,
        });
        break;
      case "Update":
        const updatedPartners = update(partners, {
          $splice: [[partners.indexOf(oldData), 1, newData]],
        });
        this.setState({
          partners: updatedPartners,
        });
        break;
      default:
        break;
    }
  };

  handleValidation = () => {
    let fields = this.state;
    let errors = {};
    let formIsValid = true;
    //avartar validataion
    if (!fields["avartar"]) {
      formIsValid = false;
      errors["avartar"] = "This field is required!";
    }
    //fantasiaName validataion
    if (!fields["fantasiaName"]) {
      formIsValid = false;
      errors["fantasiaName"] = "Cannot be empty";
    }
    //companyName validataion
    if (!fields["companyName"]) {
      formIsValid = false;
      errors["companyName"] = "Cannot be empty";
    }
    //companyNumber validataion
    if (!fields["companyNumber"]) {
      formIsValid = false;
      errors["companyNumber"] = "Cannot be empty";
    }

    //companyPhone validataion
    if (!fields["companyPhone"]) {
      formIsValid = false;
      errors["companyPhone"] = "Cannot be empty";
    }
    //address validataion
    if (!fields["address"]) {
      formIsValid = false;
      errors["address"] = "Cannot be empty";
    }
    //shoppingNumber validataion
    if (!fields["shoppingNumber"]) {
      formIsValid = false;
      errors["shoppingNumber"] = "Cannot be empty";
    }
    //neighborhood validataion
    if (!fields["neighborhood"]) {
      formIsValid = false;
      errors["neighborhood"] = "Cannot be empty";
    }
    //city validataion
    if (!fields["city"]) {
      formIsValid = false;
      errors["city"] = "Cannot be empty";
    }
    //state validataion
    if (!fields["state"]) {
      formIsValid = false;
      errors["state"] = "Cannot be empty";
    }

    this.setState({ errors: errors });
    return formIsValid;
  };

  getStepContent = (stepIndex) => {
    const {
      fantasiaName,
      companyName,
      companyNumber,
      companyPhone,
      address,
      shoppingNumber,
      neighborhood,
      city,
      state,
      avartar,
      partners,
    } = this.state;
    const shoppingDetailState = {
      fantasiaName,
      companyName,
      companyNumber,
      companyPhone,
      address,
      shoppingNumber,
      neighborhood,
      city,
      state,
      avartar,
    };
    const partnerPageState = {
      partners,
    };
    switch (stepIndex) {
      case 0:
        return (
          <ShoppingDetailPage
            handleDetailsChange={this.handleDetailsChange}
            shoppingDetailState={shoppingDetailState}
            handleChangeShoppingAvartar={this.handleChangeShoppingAvartar}
            errors={this.state.errors}
            handleCompanyNumberChange={this.handleCompanyNumberChange}
          />
        );
      case 1:
        return (
          <PartnerPage
            partnerPageState={partnerPageState}
            handleChangePartner={this.handleChangePartner}
          />
        );
      case 2:
        return <TeamPage handleUserChange={this.handleUserChange} />;
      default:
        return (
          <ShoppingDetailPage
            handleDetailsChange={this.handleDetailsChange}
            shoppingDetailState={shoppingDetailState}
          />
        );
    }
  };

  handlSaveNewShoppiing = async () => {
    const {
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
    } = this.state;
    const postBody = {
      name: fantasiaName,
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
    };
    const newShopping = await addNewShoppingApi(postBody);
    newShopping.products = []
    const { onSetMalls, malls } = this.props;
    let updatedMalls = update(malls, {
      $push: [newShopping],
    });
    onSetMalls(updatedMalls);
    this.props.history.push("/malls/");
  };

  handleCompanyNumberChange = (event) => {
    const value = event.target ? event.target.value : event
    if(value) {
      const { partners } = this.props
      const existedPartners = partners && partners.find((p) => p.companyNumber === value)
      if (existedPartners) {
        this.setState({companyName: existedPartners.companyName});
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { activeStep, steps } = this.state;
    return (
      <Paper>
        <div className={classes.root}>
          <div className="col-md-8" style={{ margin: "auto" }}>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnector />}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
          <div>
            <React.Fragment>
              <div className="row justify-content-center">
                {this.getStepContent(activeStep)}
              </div>
              <div style={{ padding: 30, textAlign: "right" }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={this.handleBack}
                  className={classes.backButton}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleNext}
                >
                  {activeStep === steps.length - 1 ? "Add Shopping" : "Add"}
                </Button>
              </div>
            </React.Fragment>
          </div>
        </div>
      </Paper>
    );
  }
}

CreateShoppingPage.propTypes = {
  onSetMalls: PropTypes.func.isRequired,
  malls: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    onSetMalls: (malls) => dispatch(setMalls(malls)),
    onSetUsers: (users) => dispatch(setUsers(users)),
    onSetPartners: (partners) => dispatch(setPartners(partners)),
  };
}

const mapStateToProps = createStructuredSelector({
  malls: makeSelectMalls(),
  users: makeSelectUsers(),
  partners: makeSelectPartners(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(CreateShoppingPage));
