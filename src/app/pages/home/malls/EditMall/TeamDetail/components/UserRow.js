/* eslint-disable no-restricted-imports */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import PropTypes from "prop-types";
import {
  Radio,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const useStyles = () => ({
  root: {
    display: "flex",
  },
});

class UserRow extends React.Component {
  render() {
    const { checked, value, user,handleToggle,name } = this.props;
    return (
      <ListItem
        alignItems="flex-start"
        key={user.id}
        dense
        button
        onClick={(e) =>handleToggle(e,value,name)}
        style={{background: '#fff', marginBottom: 5, paddingLeft: 5}}
      >
        <ListItemIcon style={{minWidth: 45}}>
          <Radio
            checked={checked}
            value={value}
            name="radio-button-demo"
            color="primary"
            inputProps={{ "aria-label": value }}
          />
        </ListItemIcon>
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={user.profileImage}
            style={{ borderRadius: 5 }}
          />
        </ListItemAvatar>
        <ListItemText
          primary={user.username}
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" color="textPrimary">
                {user.userType}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    );
  }
}

UserRow.propTypes = {
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default withStyles(useStyles)(UserRow);
