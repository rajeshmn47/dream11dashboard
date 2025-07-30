import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ConfirmDialog = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle  sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>{title || "Confirm Action"}</DialogTitle>
      <DialogContent  sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <DialogContentText>{content || "Are you sure?"}</DialogContentText>
      </DialogContent>
      <DialogActions  sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
