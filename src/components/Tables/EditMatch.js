import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, CircularProgress, Box } from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "constants/userconstants";
import { API } from "api";

export default function EditMatchModal({ matchId, matchdata, isOpen, onClose, onSave }) {
    const [match, setMatch] = useState(null);
    const [liveMatch, setLiveMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getmatch(matchId);
    }, [matchId]);

    const handleChange = (e) => {
        setMatch({ ...match, [e.target.name]: e.target.value });
    };

    const handleLiveChange = (e) => {
        setLiveMatch({ ...liveMatch, [e.target.name]: e.target.value });
    };

    async function getmatch(id) {
        if (id) {
            setLoading(true);
            API.get(`${URL}/getmatch/${id}`)
                .then((res) => {
                    setMatch(res.data?.match);
                    setLiveMatch(res.data?.livematch);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching match:", err);
                    setLoading(false);
                });
        }
    }

    const handleSave = async () => {
        try {
            setLoading(true);
            // Combine date and time into a single Date object
            const combinedDateTime = new Date(match.date);
            const [hours, minutes] = match?.time?.split(":") || new Date(match.date).toISOString().split("T")[1].slice(0, 5).split(":");
            combinedDateTime.setHours(hours);
            combinedDateTime.setMinutes(minutes);

            // Update match object with combined date and time
            let live=liveMatch?liveMatch:{}
            const updatedMatch = { ...match,...live, date: combinedDateTime.toISOString() };

            await onSave(updatedMatch);
            setLoading(false);
            onClose();
        } catch (err) {
            console.error("Update failed:", err);
            setLoading(false);
        }
    };

    const handleAdvancedEdit = () => {
        navigate(`/advanced-edit/${matchId}`);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm"
            sx={{ backgroundColor: "", color: "#ffffff" }}>
            <DialogTitle sx={{ backgroundColor: "#344767", fontWeight: "bold", fontSize: "1.5rem", color: "#ffffff", p: 3 }}>
                Edit Match
            </DialogTitle>

            <DialogContent dividers sx={{ backgroundColor: "#344767", color: "#ffffff", p: 3, position: "relative" }}>
                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center" position="absolute" top={0} left={0} right={0} bottom={0} bgcolor="rgba(0, 0, 0, 0.5)" zIndex={1}>
                        <CircularProgress />
                    </Box>
                )}
                <>
                    {/* Upcoming Match Editing Section */}
                    <Box mb={3}>
                        <h3>Upcoming Match Details</h3>
                        <TextField
                            label="Match Name"
                            fullWidth
                            name="matchTitle"
                            value={match?.matchTitle || ""}
                            onChange={handleChange}
                            margin="normal"
                            sx={{ borderRadius: "5px" }}
                        />

                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Match Date"
                                    type="date"
                                    fullWidth
                                    name="date"
                                    value={match?.date ? new Date(match.date).toISOString().split("T")[0] : ""}
                                    onChange={handleChange}
                                    sx={{ borderRadius: "5px" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Match Time"
                                    type="time"
                                    fullWidth
                                    name="time"
                                    value={match?.time ? match?.time : match?.date ? new Date(match.date).toISOString().split("T")[1].slice(0, 5) : ""}
                                    onChange={handleChange}
                                    sx={{ borderRadius: "5px" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Home Team Name"
                                    fullWidth
                                    name="teamHomeName"
                                    value={match?.teamHomeName || ""}
                                    onChange={handleChange}
                                    margin="normal"
                                    sx={{ borderRadius: "5px" }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Away Team Name"
                                    fullWidth
                                    name="teamAwayName"
                                    value={match?.teamAwayName || ""}
                                    onChange={handleChange}
                                    margin="normal"
                                    sx={{ borderRadius: "5px" }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Live Match Editing Section */}
                    {liveMatch && <Box>
                        <h3>Live Match Details</h3>
                        <TextField
                            select
                            label="Match Status"
                            fullWidth
                            name="result"
                            value={liveMatch?.result || "Upcoming"}
                            onChange={handleLiveChange}
                            margin="normal"
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
                            <MenuItem value="Scheduled">Scheduled</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Upcoming">Upcoming</MenuItem>
                            <MenuItem value="Complete">Completed</MenuItem>
                            <MenuItem value="Stumps">Stumps</MenuItem>
                            <MenuItem value="Break">Break</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Match in Play"
                            fullWidth
                            name="result"
                            value={liveMatch?.isInPlay || false}
                            onChange={handleLiveChange}
                            margin="normal"
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
                            <MenuItem value="">play status...</MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </TextField>

                        {/* Additional live match details */}
                        <TextField
                            label="Toss Result"
                            fullWidth
                            name="tossResult"
                            value={liveMatch?.toss || ""}
                            onChange={handleLiveChange}
                            margin="normal"
                            sx={{ borderRadius: "5px" }}
                        />

                        <TextField
                            label="Update Result"
                            fullWidth
                            name="updateResult"
                            value={liveMatch?.result || ""}
                            onChange={handleLiveChange}
                            margin="normal"
                            sx={{ borderRadius: "5px" }}
                        />
                    </Box>}
                </>
            </DialogContent>

            <DialogActions sx={{ backgroundColor: "#344767", color: "#ffffff", p: 2 }}>
                <Button variant="outlined" onClick={onClose} sx={{ color: "#ffffff !important", borderColor: "#bbb" }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={loading} sx={{ backgroundColor: "#4caf50", color: "#ffffff !important" }}>
                    Save Changes
                </Button>
                <Button variant="contained" onClick={handleAdvancedEdit} sx={{ backgroundColor: "#1976d2", color: "#ffffff !important" }}>
                    Advanced Editing
                </Button>
            </DialogActions>
        </Dialog>
    );
}
