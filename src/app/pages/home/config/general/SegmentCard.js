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

import { deleteSegmentByIdApi, addNewSegmentApi,updateSegmentApi } from "../index/api";

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

// export default function SegmentsCard() {
class SegmentsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl5: null,
      segmentText: "",
      segments: [],
      activeSegmentId: "",
      activeSegmentIndex: "",
      editable: false,
    };
  }

  componentDidMount = async () => {
    const { segments } = this.state;
    if (segments.length === 0) {
      const result = await this.fetchSegmentsApi();
      this.setState({
        segments: result.segments,
      });
    }
  };

  fetchSegmentsApi = async () => {
    const res = await fetch(`${API_URL}/api/segments`);
    const data = await res.json();
    return data;
  };

  handleClicKActionMenu = (event, activeSegmentId) => {
    if (this.state.anchorEl5 !== event.currentTarget) {
      this.setState({ anchorEl5: event.currentTarget, activeSegmentId }); // eslint-disable-line
    }
  };
  handleCloseActionMenu = () => {
    this.setState({
      anchorEl5: null,
    });
  };

  handleClickOptionMenu = async (event, target) => {
    const { activeSegmentId, segments } = this.state;
    if (target === "Delete") {
      const filteredSegments = segments.filter(
        (segment) => segment.id !== activeSegmentId
      );
      this.setState({
        segments: filteredSegments,
      });
      await deleteSegmentByIdApi(activeSegmentId);
    } else {
      const segmentIds = segments.map((segment) => segment.id);
      const currentSegmentIndex = segmentIds.findIndex(
        (segmentId) => segmentId === activeSegmentId
      );
      const currentSegment = segments[currentSegmentIndex];
      this.setState({
        editable: true,
        activeSegmentIndex: currentSegmentIndex,
        segmentText: currentSegment.name,
      });
      
    }
    this.handleCloseActionMenu();
  };
  handleChangeSegementText = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  addNewSegment = async () => {
    const { segments, segmentText, editable, activeSegmentIndex } = this.state;
    if (segmentText !== "") {
      if (editable) {
        const updatedSegments = update(segments, {
          [activeSegmentIndex]: { name: { $set: segmentText } },
        });
        this.setState({
          segments: updatedSegments,
          editable: false,
          segmentText: "",
        });
        const id = updatedSegments[activeSegmentIndex].id;
        await updateSegmentApi(id,updatedSegments[activeSegmentIndex])
      } else {
        const postBody = {
          name: segmentText,
          description: "description",
        };
        const result = await addNewSegmentApi(postBody);
        const updatedSegments = update(segments, {
          $push: [result],
        });
        this.setState({
          segments: updatedSegments,
          segmentText: "",
        });
      }
    }
  };

  render() {
    const { classes } = this.props;
    const { segmentText, segments } = this.state;
    return (
      <React.Fragment>
        <Typography style={{ float: "left", color: "black", fontSize: 18 }}>
          Segements
        </Typography>
        <div
          className="kt-separator kt-separator--solid"
          style={{ paddingTop: 30 }}
        ></div>
        <TextField
          id="segmentsTxt"
          name="segmentText"
          className={clsx(classes.margin)}
          variant="outlined"
          placeholder="please ..."
          fullWidth
          type="text"
          value={segmentText}
          onChange={(e) => this.handleChangeSegementText(e)}
          InputProps={{
            className: classes.margin,
            endAdornment: (
              <InputAdornment position="end">
                <Icon
                  className={classes.iconHover}
                  style={{ fontSize: 20 }}
                  onClick={this.addNewSegment}
                >
                  add
                </Icon>
              </InputAdornment>
            ),
          }}
        />
        <List className={classes.root}>
          {segments.map((segment, index) => {
            const labelId = `checkbox-list-label-${segment.id}`;
            return (
              <ListItem key={segment.id} role={undefined} dense button>
                <ListItemText
                  id={labelId}
                  primary={
                    <Typography style={{ color: "black" }}>
                      {segment.name}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction style={{ right: 0 }}>
                  <IconButton
                    aria-label="More"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(e) => this.handleClicKActionMenu(e, segment.id)}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl5}
                    keepMounted
                    open={Boolean(this.state.anchorEl5)}
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
export default withStyles(useStyles)(SegmentsCard);
