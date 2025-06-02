import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from "@mui/material";
import { useState } from "react";

export default function AddSquadModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    teamId: "",
    squadId: "",
    seriesId: "",
    teamName: "",
    players: [],
  });

  const [player, setPlayer] = useState({
    playerId: "",
    playerName: "",
    position: "",
    image: "",
  });

  const handleAddPlayer = () => {
    setFormData({ ...formData, players: [...formData.players, player] });
    setPlayer({ playerId: "", playerName: "", position: "", image: "" });
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePlayerChange = (e) => setPlayer({ ...player, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    onSave(formData);
    onClose();
    setFormData({ teamId: "", squadId: "", seriesId: "", teamName: "", players: [] });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Add Squad</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={6}><TextField fullWidth name="teamId" label="Team ID" value={formData.teamId} onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="squadId" label="Squad ID" value={formData.squadId} onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="seriesId" label="Series ID" value={formData.seriesId} onChange={handleChange} /></Grid>
          <Grid item xs={6}><TextField fullWidth name="teamName" label="Team Name" value={formData.teamName} onChange={handleChange} /></Grid>

          <Grid item xs={12}><strong>Add Player</strong></Grid>
          <Grid item xs={3}><TextField fullWidth name="playerId" label="Player ID" value={player.playerId} onChange={handlePlayerChange} /></Grid>
          <Grid item xs={3}><TextField fullWidth name="playerName" label="Player Name" value={player.playerName} onChange={handlePlayerChange} /></Grid>
          <Grid item xs={3}><TextField fullWidth name="position" label="Position" value={player.position} onChange={handlePlayerChange} /></Grid>
          <Grid item xs={3}><TextField fullWidth name="image" label="Image URL" value={player.image} onChange={handlePlayerChange} /></Grid>
          <Grid item xs={12}><Button onClick={handleAddPlayer} variant="outlined">Add Player to Squad</Button></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
