import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";

export default function EditSquadModal({ open, onClose, squadData, onUpdate }) {
  const [formData, setFormData] = useState(squadData);

  useEffect(() => {
    setFormData(squadData || {});
  }, [squadData]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Squad</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}><TextField fullWidth name="teamId" label="Team ID" value={formData?.teamId || ""} onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="squadId" label="Squad ID" value={formData?.squadId || ""} onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="seriesId" label="Series ID" value={formData?.seriesId || ""} onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="teamName" label="Team Name" value={formData?.teamName || ""} onChange={handleChange} /></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
}
