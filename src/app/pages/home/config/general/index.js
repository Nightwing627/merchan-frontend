import React from "react";
import { Grid } from "@material-ui/core";
import CardRow from "./CardRow";
class GeneralPage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="kt-separator kt-separator--dashed"></div>
        <div className="kt-section__content">
          <Grid container spacing={1}>
            <Grid container item xs={12} spacing={3}>
              <CardRow />
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
}

export default GeneralPage;
