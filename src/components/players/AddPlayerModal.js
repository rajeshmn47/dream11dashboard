import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from "@mui/material";
import axios from "axios";

const AddPlayerModal = ({ open, onClose, refresh }) => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    firstname: "",
    lastname: "",
    image: "",
    dateofbirth: "",
    country_id: "",
    flagUrls: [""],
    teamId: "",
    position: "",
    teamIds: [""],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/player/create", form);
      refresh();
      onClose();
    } catch (err) {
      alert("Error creating player");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Add Player</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Grid container spacing={1}>
          {["id", "name", "firstname", "lastname", "image", "dateofbirth", "country_id", "teamId", "position"].map(field => (
            <Grid item xs={12} key={field}>
              <TextField
                fullWidth
                label={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPlayerModal;
