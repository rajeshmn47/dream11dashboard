import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Typography, Box } from "@mui/material";
import axios from "axios";
import { URL } from "constants/userconstants";
import { CloudUpload } from "@mui/icons-material";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./../../firebase";

const EditPlayerModal = ({ open, onClose, onUpdate, player, refresh }) => {
  const [form, setForm] = useState(player);
  const [selectedFile, setSelectedFile] = useState(null);
  const existingImageUrl = player?.id ? `https://firebasestorage.googleapis.com/v0/b/dreamelevenclone.appspot.com/o/images%2F${player.id}.png?alt=media&token=4644f151-3dfd-4883-9398-4191bed34854` : null;

  useEffect(() => {
    setForm(player);
  }, [player]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const uploadImageToFirebase = async (file) => {
    try {
      const id = form.id;
      const fileExtension = file.name.split(".").pop(); // preserve original extension
      const fileName = `${id}.png`;
      const storageRef = ref(storage, `images/${fileName}`);

      await uploadBytes(storageRef, file);

      // You don't need to save the URL, just return the ID
      return { id };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    let file = await convertToPNG(e.target.files[0])
    setSelectedFile(file);
  };

  const handleUpdate = async () => {
    try {
      if (selectedFile) {
        await uploadImageToFirebase(selectedFile);
      }
      await axios.put(`${URL}/player/update/${player.id}`, form);
      await refresh();
      onClose();
      onUpdate();
    } catch (err) {
      alert("Error updating player");
    }
  };

  const convertToPNG = (file) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = window.URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            const pngFile = new File([blob], `${file.name.split(".")[0]}.png`, {
              type: "image/png",
            });
            resolve(pngFile);
          },
          "image/png",
          1
        );
      };
    });

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
          <Box
            sx={{
              border: "2px dashed #ccc",
              borderRadius: 2,
              width: "100%",
              height: 100,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginTop: 2,
              "&:hover": { borderColor: "#1976d2" },
            }}
            component="label"
          >
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
            {existingImageUrl && !selectedFile && (
              <img
                src={existingImageUrl}
                alt="Current"
                style={{ width: 40, height: 40, objectFit: "cover", marginBottom: 8, borderRadius: 8 }}
              />
            )}
            {selectedFile && (
              <Typography variant="body2">{selectedFile.name}</Typography>
            )}
            <CloudUpload sx={{ fontSize: 40, color: "#1976d2" }} />
            <Typography variant="body2">Click to Upload / Replace</Typography>
          </Box>
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