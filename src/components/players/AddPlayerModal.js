import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, MenuItem, RadioGroup, Radio, FormControlLabel, Typography, Box } from "@mui/material";
import axios from "axios";
import { URL } from "constants/userconstants";
import { API } from "api";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./../../firebase";
import { UploadFile } from "@mui/icons-material";


const AddPlayerModal = ({ open, onClose, onCreate, refresh }) => {
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

  const [selectedFile, setSelectedFile] = useState(null);

  const [imageMode, setImageMode] = useState("url"); // "url" or "upload"
  const [file, setFile] = useState(null);

  const handleImageChange = async (e) => {
    let file = await convertToPNG(e.target.files[0])
    setSelectedFile(file);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generate6DigitId = () => Math.floor(100000 + Math.random() * 900000).toString();

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

  // Upload image to Firebase and return only the ID
  const uploadImageToFirebase = async (file) => {
    try {
      const id = generate6DigitId();
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

  const handleSubmit = async () => {
    try {
      if (selectedFile) {
        const { id } = await uploadImageToFirebase(selectedFile);
        form.id = id; // store only the ID in your database
        form.image = id
      }
      await API.post(`${URL}/player/create`, form);
      await refresh();
      onClose();
      onCreate();
    } catch (err) {
      alert("Error creating player");
    }
  };

  const handleSubmite = async () => {
    try {
      if (selectedFile) {
        uploadImageToFirebase(selectedFile).then(({ id, url }) => {
          form.image = url;
          form.id = id;
        })
        await API.post(`${URL}/player/create`, form);
        refresh();
        onClose();
      }
    } catch (err) {
      alert("Error creating player");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Add Player</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Grid container spacing={1}>
          {["name", "firstname", "lastname", "dateofbirth", "country_id", "teamId", "position"].map(field => (
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
          <Box
            sx={{
              border: "2px dashed #1976d2",
              borderRadius: 2,
              padding: 1,
              margin: "25px 0",
              textAlign: "center",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              //gap: 1,
              backgroundColor: "#f5f5f5",
              width: "100%",
              "&:hover": { backgroundColor: "#e3f2fd" },
            }}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <UploadFile sx={{ fontSize: '30px !important', color: "#1976d2" }} />
            <Typography variant="subtitle1" color="textSecondary">
              Click to upload an image
            </Typography>
            {selectedFile && (
              <Typography variant="body2" color="textPrimary">
                Selected: {selectedFile.name}
              </Typography>
            )}
            <input
              id="fileInput"
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Box>
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
