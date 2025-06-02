import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";

export default function TeamModal({ isOpen, onClose, onSuccess, editData }) {
  const [form, setForm] = useState({
    id: "",
    teamName: "",
    shortName: "",
    image: "",
    flagUrl: "",
    type: "international",
    country: "",
    league: "",
    region: "",
  });

  useEffect(() => {
    if (editData) setForm(editData);
    else
      setForm({
        id: "",
        teamName: "",
        shortName: "",
        image: "",
        flagUrl: "",
        type: "international",
        country: "",
        league: "",
        region: "",
      });
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editData) {
        await axios.put(`/api/teams/${editData._id}`, form);
      } else {
        await axios.post("/api/teams", form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Error: " + err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>{editData ? "Edit Team" : "Add Team"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers  sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
          <Grid container spacing={2}>
            {[
              { label: "ID", name: "id" },
              { label: "Team Name", name: "teamName" },
              { label: "Short Name", name: "shortName" },
              { label: "Image URL", name: "image" },
              { label: "Flag URL", name: "flagUrl" },
              { label: "Country", name: "country" },
              { label: "League", name: "league" },
              { label: "Region", name: "region" },
            ].map((field) => (
              <Grid item xs={6} key={field.name}>
                <TextField
                  fullWidth
                  label={field.label}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="international">International</MenuItem>
                  <MenuItem value="domestic">Domestic</MenuItem>
                  <MenuItem value="league">League</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions  sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {editData ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
