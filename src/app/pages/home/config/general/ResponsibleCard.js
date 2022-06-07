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
  deleteResponsibleByIdApi,
  addNewResponsibleApi,
  updateResponsibleApi,
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

// export default function ResponsibleCard() {
class ResponsibleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl7: null,
      responsibleText: "",
      responsibles: [],
      activeResponsibleId: "",
      activeResponsibleIndex: "",
      editable: false,
    };
  }

  componentDidMount = async () => {
    if (this.state.responsibles.length === 0) {
      const result = await this.fetchResponsiblesApi();
      this.setState({
        responsibles: result.responsibles,
      });
    }
  };

  fetchResponsiblesApi = async () => {
    const res = await fetch(`${API_URL}/api/responsibles`);
    const data = await res.json();
    return data;
  };

  handleClicKActionMenu = (event, activeResponsibleId) => {
    if (this.state.anchorEl7 !== event.currentTarget) {
      this.setState({ anchorEl7: event.currentTarget, activeResponsibleId }); // eslint-disable-line
    }
  };
  handleCloseActionMenu = () => {
    this.setState({
      anchorEl7: null,
    });
  };

  handleClickOptionMenu = async (event, target) => {
    const { activeResponsibleId, responsibles } = this.state;
    if (target === "Delete") {
      const filteredResponsibles = responsibles.filter(
        (responsible) => responsible.id !== activeResponsibleId
      );
      this.setState({
        responsibles: filteredResponsibles,
      });
      await deleteResponsibleByIdApi(activeResponsibleId);
    } else {
      const responsibleIds = responsibles.map((responsible) => responsible.id);
      const currentResponsibleIndex = responsibleIds.findIndex(
        (responsibleId) => responsibleId === activeResponsibleId
      );
      const currentResponsible = responsibles[currentResponsibleIndex];
      this.setState({
        editable: true,
        activeResponsibleIndex: currentResponsibleIndex,
        responsibleText: currentResponsible.name,
      });
    }
    this.handleCloseActionMenu();
  };
  handleChangeResponsibleText = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  addNewResponsible = async () => {
    const {
      responsibles,
      responsibleText,
      editable,
      activeResponsibleIndex,
    } = this.state;
    if (responsibleText !== "") {
      if (editable) {
        const updatedResponsibles = update(responsibles, {
          [activeResponsibleIndex]: { name: { $set: responsibleText } },
        });
        this.setState({
          segments: updatedResponsibles,
          editable: false,
          responsibleText: "",
        });
        const id = updatedResponsibles[activeResponsibleIndex].id;
        await updateResponsibleApi(
          id,
          updatedResponsibles[activeResponsibleIndex]
        );
      } else {
        const postBody = {
          name: responsibleText,
          description: "description",
        };
        const result = await addNewResponsibleApi(postBody);
        const updatedResponsibles = update(responsibles, {
          $push: [result],
        });
        this.setState({
          responsibles: updatedResponsibles,
          responsibleText: "",
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography style={{ float: "left", color: "black", fontSize: 18 }}>
          Responsibles
        </Typography>
        <div
          className="kt-separator kt-separator--solid"
          style={{ paddingTop: 30 }}
        ></div>
        <TextField
          id="responsibleTxt"
          name="responsibleText"
          className={clsx(classes.margin)}
          variant="outlined"
          placeholder="please ..."
          fullWidth
          type="text"
          value={this.state.responsibleText}
          onChange={(e) => this.handleChangeResponsibleText(e)}
          InputProps={{
            className: classes.margin,
            endAdornment: (
              <InputAdornment position="end">
                <Icon
                  className={classes.iconHover}
                  style={{ fontSize: 20 }}
                  onClick={this.addNewResponsible}
                >
                  add
                </Icon>
              </InputAdornment>
            ),
          }}
        />
        <List className={classes.root}>
          {this.state.responsibles.map((responsible, index) => {
            const labelId = `checkbox-list-label-${responsible.id}`;
            return (
              <ListItem key={responsible.id} role={undefined} dense button>
                <ListItemText
                  id={labelId}
                  primary={
                    <Typography style={{ color: "black" }}>
                      {responsible.name}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction style={{ right: 0 }}>
                  <IconButton
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(e) =>
                      this.handleClicKActionMenu(e, responsible.id)
                    }
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl7}
                    keepMounted
                    open={Boolean(this.state.anchorEl7)}
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
export default withStyles(useStyles)(ResponsibleCard);
