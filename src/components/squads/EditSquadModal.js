import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, Autocomplete
} from "@mui/material";
import { API } from "api";
import { URL } from "constants/userconstants";
import { useEffect, useState } from "react";

export default function EditSquadModal({ open, onClose, squadData, onUpdate }) {
  const [formData, setFormData] = useState(squadData);
  const [player, setPlayer] = useState({ playerId: "", playerName: "", position: "", image: "" });

  const [teamsList, setTeamsList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [allPlayersList, setAllPlayersList] = useState([]);

  useEffect(() => {
    setFormData(squadData || {
      teamId: "", squadId: "", seriesId: "", teamName: "", teamShortName: "", teamFlagUrl: "", players: []
    });
  }, [squadData]);

  // Fetch Series
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await API.get(`${URL}/api/match/series/all`);
        setSeriesList(response.data);
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };
    fetchSeries();
  }, []);

  // Fetch Teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await API.get(`${URL}/api/match/team/all`);
        setTeamsList(response.data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };
    fetchTeams();
  }, []);

  // Fetch Players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await API.get(`${URL}/player/all`);
        setAllPlayersList(response.data);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  const handleAddPlayer = () => {
    if (!player.playerId) return;
    setFormData(prev => ({ ...prev, players: [...prev.players, player] }));
    setPlayer({ playerId: "", playerName: "", position: "", image: "" });
  };

  const handleRemovePlayer = (id) => {
    if (!player.playerId) return;
    setFormData(prev => ({ ...prev, players: [...prev.players.filter((p) => p.playerId == id)] }));
    setPlayer({ playerId: "", playerName: "", position: "", image: "" });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Edit Squad</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={3}>
            <TextField
              fullWidth
              name="squadId"
              label="Squad Id"
              value={formData?.squadId || ""}
              onChange={(e) => setFormData({ ...formData, squadId: e.target.value })}
            />
          </Grid>

          {/* Team Selection */}
          <Grid item xs={6}>
            <Autocomplete
              options={teamsList}
              getOptionLabel={(option) => option.teamName}
              value={teamsList.find(t => t.teamName === formData?.teamName) || null}
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
              value={seriesList.find(s => s.seriesId === formData?.seriesId) || null}
              onChange={(e, newValue) => {
                if (newValue) setFormData(prev => ({ ...prev, seriesId: newValue.seriesId }));
              }}
              renderInput={(params) => <TextField {...params} label="Series Name" fullWidth />}
            />
          </Grid>

          {/* Player Selection */}
          <Grid item xs={12}><strong>Edit / Add Player</strong></Grid>
          <Grid item xs={3}>
            <Autocomplete
              options={allPlayersList}
              getOptionLabel={(option) => option.name}
              value={allPlayersList.find(p => p.playerId === player.playerId) || null}
              onChange={(e, newValue) => {
                if (newValue) {
                  setPlayer({
                    playerId: newValue.id,
                    playerName: newValue.name,
                    position: newValue.position,
                    image: newValue.image
                  });
                }
              }}
              renderInput={(params) => <TextField {...params} label="Player Name" fullWidth />}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth name="playerId" label="Player ID" value={player.playerId} onChange={(e) => setPlayer({ ...player, playerId: e.target.value })} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth name="position" label="Position" value={player.position} onChange={(e) => setPlayer({ ...player, position: e.target.value })} />
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth name="image" label="Image URL" value={player.image} onChange={(e) => setPlayer({ ...player, image: e.target.value })} />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={handleAddPlayer} variant="outlined">Add Player to Squad</Button>
          </Grid>
          {formData?.players?.length > 0 && (
            <div className="mt-4" style={{ width: "100%", marginTop: "16px" }}>
              <h3 className="text-lg font-semibold mb-2">Selected Players</h3>
              <ul className="space-y-2" style={{ width: "100%" }}>
                {formData.players.map((player, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: "space-between", width: "100%", marginTop: "8px" }} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                    <div style={{ display: 'flex', justifyContent: "space-between", width: "300px" }}>
                      <p className="font-medium">{player.playerName}</p>
                      <p className="text-sm text-gray-500">ID: {player.playerId} | Role: {player.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </Grid>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
}
