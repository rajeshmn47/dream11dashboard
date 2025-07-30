import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid, MenuItem } from "@mui/material";
import { useState } from "react";

export default function AddUserModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
    phonenumber: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
    setFormData({ name: "", email: "", role: "", password: "", phonenumber: "" });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Add User</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}>
            <TextField fullWidth name="username" label="Name" value={formData.username} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="email" label="Email" value={formData.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="phonenumber" label="Phone Number" value={formData.phonenumber} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
