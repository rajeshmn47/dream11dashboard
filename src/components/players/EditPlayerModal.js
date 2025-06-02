import React, { useState,useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from "@mui/material";
import axios from "axios";

const EditPlayerModal = ({ open, onClose, player, refresh }) => {
  const [form, setForm] = useState(player);

  useEffect(() => {
    setForm(player);
  }, [player]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/api/player/update/${player.id}`, form);
      refresh();
      onClose();
    } catch (err) {
      alert("Error updating player");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Player</DialogTitle>
      <DialogContent>
        {/* form fields */}
        {/* same as AddPlayerModal */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPlayerModal;
