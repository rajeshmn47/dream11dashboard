import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid } from "@mui/material";
import axios from "axios";
import { URL } from "constants/userconstants";

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
      await axios.put(`${URL}/player/update/${player.id}`, form);
      refresh();
      onClose();
    } catch (err) {
      alert("Error updating player");
    }
  };

  return (

    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Edit Player</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767" }}>
        {/* form fields */}
        {/* same as AddPlayerModal */}
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              item xs={12}
              label="First Name"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              item xs={12}
              label="Last Name"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              item xs={12}
              label="Image URL / ID"
              name="image"
              value={form.image}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              item xs={12}
              label="Date of Birth"
              name="dateofbirth"
              value={form.dateofbirth}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              item xs={12}
              label="Player ID"
              name="id"
              value={form.id}
              onChange={handleChange}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Country ID"
              name="country_id"
              value={form.country_id}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Team ID"
              name="teamId"
              value={form.teamId}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Position"
              name="position"
              value={form.position}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Batting Hand"
              name="battingHand"
              value={form.battingHand}
              onChange={handleChange}
              select
              fullWidth
              sx={{
                backgroundColor: "",
                borderRadius: "5px",
                "& .MuiInputBase-root": {
                  height: "50px", // Increases height
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiSelect-select": {
                  padding: "14px",  // More padding for better touch experience
                  minHeight: "50px", // Ensures uniform height
                }
              }}
            >
              <MenuItem value="right">Right</MenuItem>
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bowling Hand"
              name="bowlingHand"
              value={form.bowlingHand}
              onChange={handleChange}
              select
              fullWidth
              sx={{
                backgroundColor: "",
                borderRadius: "5px",
                "& .MuiInputBase-root": {
                  height: "50px", // Increases height
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiSelect-select": {
                  padding: "14px",  // More padding for better touch experience
                  minHeight: "50px", // Ensures uniform height
                }
              }}
            >
              <MenuItem value="right">Right</MenuItem>
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Bowler Type"
              name="bowlerType"
              value={form.bowlerType}
              onChange={handleChange}
              select
              fullWidth
              sx={{
                backgroundColor: "",
                borderRadius: "5px",
                "& .MuiInputBase-root": {
                  height: "50px", // Increases height
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiSelect-select": {
                  padding: "14px",  // More padding for better touch experience
                  minHeight: "50px", // Ensures uniform height
                }
              }}
            >
              <MenuItem value="fast">Fast</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="off-spin">Off Spin</MenuItem>
              <MenuItem value="leg-spin">Leg Spin</MenuItem>
              <MenuItem value="unknown">Unknown</MenuItem>
            </TextField>
          </Grid>
        </Grid >
      </DialogContent >
      <DialogActions sx={{ backgroundColor: "#344767" }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpdate}>Update</Button>
      </DialogActions>
    </Dialog >
  );
};

export default EditPlayerModal;