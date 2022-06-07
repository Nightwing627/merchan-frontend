import React from "react";
import { Grid } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import SegmentCard from "./SegmentCard";
import AdvertiserCard from "./AdvertiserCard";
import ResponsibleCard from "./ResponsibleCard";
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));
export default function CardRow() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <SegmentCard />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <AdvertiserCard />
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <ResponsibleCard />
        </Paper>
      </Grid>
    </React.Fragment>
  );
}
