/* eslint-disable no-restricted-imports */
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Typography, CardMedia } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toAbsoluteUrl } from "../../../../../_metronic/utils/utils";
import EditIcon from "@material-ui/icons/CreateOutlined";
const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 64,
    height: 64,
    margin: 10,
    borderRadius: 4,
  },
}));

export default function UserCardComponent(props) {
  const classes = useStyles();

  return (
    <div className="col-md-3 align-self-stretch">
      <div className="kt-section" style={{margin: '0 0 20px 0'}}>
        <div className="kt-section__content">
          <Card className={classes.card}>
            <CardMedia
              className={classes.cover}
              image={toAbsoluteUrl(props.user.profileImage)}
              title="Live from space album cover"
            />
            <div className={classes.details}>
              <CardContent className={classes.content} style={{padding: '10px 0'}}>
                <Typography component="h6" variant="h6">
                  {props.user.username}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {props.user.userType}
                </Typography>
                <Link to={"/users/" + props.user.id}>
                  <EditIcon
                    style={{ position: "absolute", top: 15, right: 25, color: '#8C8C92' }}
                  />
                </Link>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
