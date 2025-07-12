import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem } from "@mui/material";
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
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="Batting Hand"
              name="battingHand"
              value={form.battingHand}
              onChange={handleChange}
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
              fullWidth
              select
              label="Bowling Hand"
              name="bowlingHand"
              value={form.bowlingHand}
              onChange={handleChange}
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
              fullWidth
              select
              label="Bowler Type"
              name="bowlerType"
              value={form.bowlerType}
              onChange={handleChange}
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
