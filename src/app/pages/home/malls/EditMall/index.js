/* eslint-disable no-restricted-imports */
import React from "react";
import update from "immutability-helper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { createStructuredSelector } from "reselect";
import { Tab, Tabs, Paper } from "@material-ui/core";
import ShoppingDetail from "./ShoppingDetail";
import PartnerDetail from "./PartnerDetail";
import TeamDetail from "./TeamDetail";
import StaticsPage from "./Statistics";
import { withStyles } from "@material-ui/core/styles";
import { makeSelectUsers } from "../../users/index/selectors";
import { makeSelectMalls, makeSelectPartners } from "../index/selectors";
import { setMalls } from "../index/actions";
import { setUsers } from "../../users/index/actions";
import { fetchAllUsersApi } from "../../users/index/api";
import { updateMallApi } from "../index/api";

const useStyles = (theme) => ({
  root: {
    backgroundColor: "white",
  },
});

class EditMallPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      activeTab: 0,
      originalMall: {
        id: "",
        fantasiaName: "",
        companyName: "",
        companyNumber: "",
        companyPhone: "",
        address: "",
        shoppingNumber: 0,
        neighborhood: "",
        city: "",
        state: "",
        partners: "",
        financialId: "",
        legalId: "",
        avartar: "",
      },
      updatedMall: {
        id: "",
        fantasiaName: "",
        companyName: "",
        companyNumber: "",
        companyPhone: "",
        address: "",
        shoppingNumber: 0,
        neighborhood: "",
        city: "",
        state: "",
        partners: "",
        financialId: "",
        legalId: "",
        avartar: "",
      },
      errors: {},
      id: "",
      shopping: null,
    };
  }

  componentDidMount = async () => {
    const { id } = this.props.match.params;
    if (id !== this.state.id && this.state.shopping === null) {
      const { malls } = this.props;
      if (malls.length !== 0) {
        const filteredMalls = malls.filter((mall) => mall.id === id);
        this.setState({
          originalMall: filteredMalls[0],
          updatedMall: filteredMalls[0],
          id,
        });
      } else {
        this.props.history.push("/malls");
      }
    }
    const { users, onSetUsers } = this.props;
    if (users.length === 0) {
      const users = await fetchAllUsersApi();
      onSetUsers(users);
    }
  };

  handleActiveTab = (event, activeTab) => {
    this.setState({
      activeTab,
    });
  };

  handleDetailsChange = (event, name) => {
    const value = event.target ? event.target.value : event;
    const updatedMall = update(this.state.updatedMall, {
      [name]: {
        $set: value,
      },
    });
    this.setState({
      updatedMall,
    });
  };

  handleChangeShoppingAvartar = (imageURL) => {
    const updatedMall = update(this.state.updatedMall, {
      avartar: {
        $set: imageURL,
      },
    });
    this.setState({
      updatedMall,
    });
  };

  handleUserChange = (name, value) => {
    const updatedMall = update(this.state.updatedMall, {
      [name]: {
        $set: value,
      },
    });
    this.setState({
      updatedMall,
    });
  };

  handleUpdateMall = async () => {
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
    } = this.state.updatedMall;
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
    await updateMallApi(id, postBody);
    const { onSetMalls, malls } = this.props;
    const mallIds = malls.map((mall) => mall.id);
    const currentMallIndex = mallIds.findIndex((mallId) => mallId === id);
    const updatedMalls = update(malls, {
      [currentMallIndex]: { $set: this.state.updatedMall },
    });
    onSetMalls(updatedMalls);
    this.props.history.push("/malls");
  };

  renderActivePage = () => {
    const { activeTab } = this.state;
    const {
      updatedMall: {
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
      },
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
    const teamPageState = {
      financialId,
      legalId,
    };

    switch (activeTab) {
      case 0:
        return (
          <ShoppingDetail
            handleDetailsChange={this.handleDetailsChange}
            shoppingDetailState={shoppingDetailState}
            handleChangeShoppingAvartar={this.handleChangeShoppingAvartar}
            handleUpdateMall={this.handleUpdateMall}
            handleCompanyNumberChange={this.handleCompanyNumberChange}
          />
        );
      case 1:
        return (
          <PartnerDetail
            partnerPageState={partnerPageState}
            handleChangePartner={this.handleChangePartner}
            handleUpdateMall={this.handleUpdateMall}
            handleCompanyNumberChangePartner={this.handleCompanyNumberChangePartner.bind(this)}
            partners={this.props.partners}
          />
        );
      case 2:
        return (
          <TeamDetail
            teamPageState={teamPageState}
            handleUserChange={this.handleUserChange}
            handleUpdateMall={this.handleUpdateMall}
          />
        );
      default:
        return null;
    }
  };

  handleChangePartner = (action, newData = null, oldData = null) => {
    const { partners } = this.state.updatedMall;
    switch (action) {
      case "Add":
        const addedPartners = update(partners, {
          $push: [newData],
        });
        const addedMall = update(this.state.updatedMall, {
          $merge: {
            partners: addedPartners,
          },
        });
        this.setState({
          updatedMall: addedMall,
        });
        break;
      case "Delete":
        const deletedPartners = update(partners, {
          $splice: [[partners.indexOf(oldData), 1]],
        });
        const deletedMall = update(this.state.updatedMall, {
          $merge: {
            partners: deletedPartners,
          },
        });
        this.setState({
          updatedMall: deletedMall,
        });
        break;
      case "Update":
        const updatedPartners = update(partners, {
          $splice: [[partners.indexOf(oldData), 1, newData]],
        });
        const updatedMall = update(this.state.updatedMall, {
          partners: {
            $set: updatedPartners,
          },
        });
        this.setState({
          updatedMall,
        });
        break;
      default:
        break;
    }
  };

  handleCompanyNumberChange = async (event) => {
    const value = event.target ? event.target.value : event
    if (value) {
      const { partners } = this.props
      const existedPartners = partners && partners.find((p) => p.companyNumber === value)
      if (existedPartners) {
        const updatedMall = update(this.state.updatedMall, {
          companyName: {
            $set: existedPartners.companyName,
          },
        });
        this.setState({
          updatedMall,
        });
      }
    }
  };

  handleCompanyNumberChangePartner (event, p) {
    const value = event.target ? event.target.value : event
    if (value) {
      const { partners } = this.props
      const existedPartners = partners && partners.find((p) => p.companyNumber === value)
      if (existedPartners) {
        const updatePartners = [...this.state.updatedMall.partners]
        const updatingPartner = updatePartners[p.rowData.id]
        if (updatingPartner) updatingPartner.companyName = existedPartners.companyName
        this.setState({
          updatedMall: { ...this.state.updatedMall, partners: updatePartners }
        });
      }
    }
  };

  render () {
    const { activeTab } = this.state;
    const { classes } = this.props;
    return (
      <div className="row">
        <div className="col-md-7">
          <div className={classes.root}>
            <Paper className='tab-header'>
              <Tabs
                value={activeTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={this.handleActiveTab}
              >
                <Tab label="ShoppingDetail" />
                <Tab label="Partners" />
                <Tab label="Team" />
              </Tabs>
            </Paper>
            {this.renderActivePage()}
          </div>
        </div>
        <div className="col-md-5">
          <Paper>
            <StaticsPage />
          </Paper>
        </div>
      </div>
    );
  }
}

EditMallPage.propTypes = {
  onSetMalls: PropTypes.func.isRequired,
  malls: PropTypes.array.isRequired,
};

const mapStateToProps = createStructuredSelector({
  malls: makeSelectMalls(),
  users: makeSelectUsers(),
  partners: makeSelectPartners(),
});

function mapDispatchToProps (dispatch) {
  return {
    onSetMalls: (malls) => dispatch(setMalls(malls)),
    onSetUsers: (users) => dispatch(setUsers(users)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(EditMallPage));
