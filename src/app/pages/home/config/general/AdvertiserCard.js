/* eslint-disable no-restricted-imports */
import React from "react";
import update from "immutability-helper";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Icon,
  ListItem,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@material-ui/core";

import MoreHorizIcon from "@material-ui/icons/MoreHoriz";

import {
  deleteAdvertiserByIdApi,
  addNewAdvertiserApi,
  updateAdvertiserApi,
} from "../index/api";

const useStyles = (theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  iconHover: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  margin: {
    maxHeight: 30,
  },
});

const ITEM_HEIGHT = 48;
const options = ["Edit", "Delete"];

const API_URL = process.env.REACT_APP_API_URL;

// export default function AdvertiserCard() {
class AdvertiserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl6: null,
      advertiserText: "",
      advertisers: [],
      activeAdvertiserId: "",
      activeAdvertiserIndex: "",
      editable: false,
    };
  }

  componentDidMount = async () => {
    if (this.state.advertisers.length === 0) {
      const result = await this.fetchAdvertisersApi();
      this.setState({
        advertisers: result.advertisers,
      });
    }
  };

  fetchAdvertisersApi = async () => {
    const res = await fetch(`${API_URL}/api/advertisers`);
    const data = await res.json();
    return data;
  };

  handleClicKActionMenu = (event, activeAdvertiserId) => {
    if (this.state.anchorEl6 !== event.currentTarget) {
      this.setState({ anchorEl6: event.currentTarget, activeAdvertiserId }); // eslint-disable-line
    }
  };
  handleCloseActionMenu = () => {
    this.setState({
      anchorEl6: null,
    });
  };

  handleClickOptionMenu = async (event, target) => {
    const { activeAdvertiserId, advertisers } = this.state;
    if (target === "Delete") {
      const filteredAdvertisers = advertisers.filter(
        (advertiser) => advertiser.id !== activeAdvertiserId
      );
      this.setState({
        advertisers: filteredAdvertisers,
      });
      await deleteAdvertiserByIdApi(activeAdvertiserId);
    } else {
      const advertiserIds = advertisers.map((responsible) => responsible.id);
      const currentAdvertiserIndex = advertiserIds.findIndex(
        (advertiserId) => advertiserId === activeAdvertiserId
      );
      const currentAdvertiser = advertisers[currentAdvertiserIndex];
      this.setState({
        editable: true,
        activeAdvertiserIndex: currentAdvertiserIndex,
        advertiserText: currentAdvertiser.name,
      });
    }
    this.handleCloseActionMenu();
  };
  handleChangeAdvertiserText = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  addNewAdvertiser = async () => {
    const {
      advertisers,
      advertiserText,
      editable,
      activeAdvertiserIndex,
    } = this.state;
    if (advertiserText !== "") {
      if (editable) {
        const updatedAdvertisers = update(advertisers, {
          [activeAdvertiserIndex]: { name: { $set: advertiserText } },
        });
        this.setState({
          advertisers: updatedAdvertisers,
          editable: false,
          advertiserText: "",
        });
        const id = updatedAdvertisers[activeAdvertiserIndex].id;
        await updateAdvertiserApi(
          id,
          updatedAdvertisers[activeAdvertiserIndex]
        );
      } else {
        const postBody = {
          name: advertiserText,
          description: "description",
        };
        const result = await addNewAdvertiserApi(postBody);
        const updatedadvertisers = update(advertisers, {
          $push: [result],
        });
        this.setState({
          advertisers: updatedadvertisers,
          advertiserText: "",
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography style={{ float: "left", color: "black", fontSize: 18 }}>
          Advertiser Types
        </Typography>
        <div
          className="kt-separator kt-separator--solid"
          style={{ paddingTop: 30 }}
        ></div>
        <TextField
          id="advertiserTxt"
          name="advertiserText"
          className={clsx(classes.margin)}
          variant="outlined"
          placeholder="please ..."
          fullWidth
          type="text"
          value={this.state.advertiserText}
          onChange={(e) => this.handleChangeAdvertiserText(e)}
          InputProps={{
            className: classes.margin,
            endAdornment: (
              <InputAdornment position="end">
                <Icon
                  className={classes.iconHover}
                  style={{ fontSize: 20 }}
                  onClick={this.addNewAdvertiser}
                >
                  add
                </Icon>
              </InputAdornment>
            ),
          }}
        />
        <List className={classes.root}>
          {this.state.advertisers.map((advertiser, index) => {
            const labelId = `checkbox-list-label-${advertiser.id}`;
            return (
              <ListItem key={advertiser.id} role={undefined} dense button>
                <ListItemText
                  id={labelId}
                  primary={
                    <Typography style={{ color: "black" }}>
                      {advertiser.name}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction style={{ right: 0 }}>
                  <IconButton
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(e) =>
                      this.handleClicKActionMenu(e, advertiser.id)
                    }
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl6}
                    keepMounted
                    open={Boolean(this.state.anchorEl6)}
                    onClose={this.handleCloseActionMenu}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: 100,
                      },
                    }}
                  >
                    {options.map((option) => (
                      <MenuItem
                        key={option}
                        selected={option === "Pyxis"}
                        onClick={(event) =>
                          this.handleClickOptionMenu(event, option)
                        }
                      >
                        {option}
                      </MenuItem>
                    ))}
                  </Menu>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </React.Fragment>
    );
  }
}
export default withStyles(useStyles)(AdvertiserCard);
