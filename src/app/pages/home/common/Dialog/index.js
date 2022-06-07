import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
  Slide,
} from "@material-ui/core";

const DidalogTransition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
class MerchanDialog extends React.Component {
  render() {
    const { open, title, description, target, openRemoveDialog,handleDialogAction } = this.props;

    return (
      <Dialog
        open={open}
        TransitionComponent={DidalogTransition}
        keepMounted
        onClose={(e) => openRemoveDialog(e, false, target)}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => handleDialogAction(e, false, target)}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={(e) => handleDialogAction(e, true, target)}
            color="primary"
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default MerchanDialog;
