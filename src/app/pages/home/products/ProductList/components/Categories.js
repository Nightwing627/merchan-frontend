/* eslint-disable no-restricted-imports */
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const useStyles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: "bold",
  },
});

class ProductCategories extends React.Component {
  constructor(props) {
    super(props);
    this.state = { checkedA: false };
  }

  handleChange = (name, event) => {
    this.setState({
      [name]: event.target.checked,
    });
  };
  render() {
    const { classes } = this.props;
    const { checkedA } = this.state;
    return (
      <div className={classes.root}>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>High Impact</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedA}
                    onChange={(e) => this.handleChange("checkedA", e)}
                    value="checkedA"
                  />
                }
                label="Escalator / Fixed - Set"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedA}
                    onChange={(e) => this.handleChange("checkedA", e)}
                    value="checkedA"
                  />
                }
                label="Food Court - Set (Tables and columns)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedA}
                    onChange={(e) => this.handleChange("checkedA", e)}
                    value="checkedA"
                  />
                }
                label="Access Doors - Mall (Set)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedA}
                    onChange={(e) => this.handleChange("checkedA", e)}
                    value="checkedA"
                  />
                }
                label="Main - Internal"
              />
            </FormGroup>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography className={classes.heading}>Medium Impact</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>Targeted media</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>Indoor Exhibition Spaces</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>External Exhibition Spaces</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>Indoor / outdoor exhibition spaces</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography className={classes.heading}>High Impact Internal / External Digital Media</Typography>
          </ExpansionPanelSummary>
        </ExpansionPanel>
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(ProductCategories);
