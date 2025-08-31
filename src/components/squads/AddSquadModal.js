import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Autocomplete
} from "@mui/material";
import { API } from "api";
import { URL } from "constants/userconstants";
import { useEffect, useState } from "react";

export default function AddSquadModal({ open, onClose, onSave }) {
  const [formData, setFormData] = useState({
    teamId: "",
    squadId: "",
    seriesId: "",
    teamName: "",
    teamShortName: "",
    teamFlagUrl: "",
    players: [],
  });

  const [player, setPlayer] = useState({
    playerId: "",
    playerName: "",
    position: "",
    image: "",
  });
  const [teamsList, setTeamsList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [allPlayersList, setAllPlayersList] = useState([]);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await API.get(`${URL}/api/match/series/all`);
        setSeriesList(response.data); // Adjust based on your actual response structure
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await API.get(`${URL}/api/match/team/all`);
        setTeamsList(response.data); // Adjust based on your actual response structure
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await API.get(`${URL}/player/all`);
        setAllPlayersList(response.data); // Adjust based on your actual response structure
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }
    fetchPlayers();
  }, []);

  const handleAddPlayer = () => {
    if (!player.id) return;
    setFormData(prev => ({ ...prev, players: [...prev.players, player] }));
    setPlayer({ id: "", playerName: "", position: "", image: "" });
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
    setFormData({
      teamId: "", squadId: "", seriesId: "", teamName: "", teamShortName: "", teamFlagUrl: "", players: []
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Add Squad</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={3}><TextField fullWidth name="squadId" label="Squad Id" value={formData.squadId} onChange={(e) => setFormData({ ...formData, squadId: e.target.value })} /></Grid>
          {/* Team Selection */}
          <Grid item xs={6}>
            <Autocomplete
              options={teamsList}
              getOptionLabel={(option) => option.teamName}
              value={teamsList.find(t => t.teamName === formData.teamName) || null}
              onChange={(e, newValue) => {
                if (newValue) {
                  setFormData(prev => ({
                    ...prev,
                    teamName: newValue.teamName,
                    teamId: newValue.id,
                    teamShortName: newValue.shortName,
                    teamFlagUrl: newValue.flagUrl
                  }));
                }
              }}
              renderInput={(params) => <TextField {...params} label="Team Name" fullWidth />}
            />
          </Grid>

          {/* Series Selection */}
          <Grid item xs={6}>
            <Autocomplete
              options={seriesList}
              getOptionLabel={(option) => option.name}
              value={seriesList.find(s => s.seriesId === formData.seriesId) || null}
              onChange={(e, newValue) => {
                if (newValue) setFormData(prev => ({ ...prev, seriesId: newValue.seriesId }));
              }}
              renderInput={(params) => <TextField {...params} label="Series Name" fullWidth />}
            />
          </Grid>

          {/* Player Selection */}
          <Grid item xs={12}><strong>Add Player</strong></Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={allPlayersList}
              getOptionLabel={(option) => option.name}
              value={allPlayersList.find(p => p.playerName === player.id) || null}
              onChange={(e, newValue) => {
                if (newValue) setPlayer(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Player Name" fullWidth />}
            />
          </Grid>
          <Grid item xs={3}><TextField fullWidth name="playerId" label="Player ID" value={player.id} onChange={(e) => setPlayer({ ...player, playerId: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField fullWidth name="position" label="Position" value={player.position} onChange={(e) => setPlayer({ ...player, position: e.target.value })} /></Grid>
          <Grid item xs={3}><TextField fullWidth name="image" label="Image URL" value={player.image} onChange={(e) => setPlayer({ ...player, image: e.target.value })} /></Grid>
          <Grid item xs={12}><Button onClick={() => handleAddPlayer()} variant="outlined">Add Player to Squad</Button></Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}
