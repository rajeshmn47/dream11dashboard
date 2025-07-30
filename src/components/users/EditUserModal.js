import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";

export default function EditUserModal({ open, onClose, userData, onUpdate }) {
  const [formData, setFormData] = useState(userData || {});

  useEffect(() => {
    setFormData(userData || {});
  }, [userData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Edit User</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12}><TextField fullWidth name="name" label="Name" value={formData?.username || ""} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth name="email" label="Email" value={formData?.email || ""} onChange={handleChange} /></Grid>
          <Grid item xs={12}><TextField fullWidth name="role" label="Role" value={formData?.role || ""} onChange={handleChange} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
}
