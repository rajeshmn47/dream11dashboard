import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, MenuItem, Grid, CircularProgress, Box
} from "@mui/material";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { URL } from "constants/userconstants";
import { API } from "api";

export default function EditMatchModal({ matchId, matchdata, isOpen, onClose, onSave }) {
    const [match, setMatch] = useState(null);
    const [liveMatch, setLiveMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (matchId) getMatch(matchId);
    }, [matchId]);

    const getMatch = async (id) => {
        setLoading(true);
        try {
            const res = await API.get(`${URL}/getmatch/${id}`);
            setMatch(res.data?.match || {});
            setLiveMatch(res.data?.livematch || {});
        } catch (err) {
            console.error("Error fetching match:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMatch(prev => ({ ...prev, [name]: value }));
    };

    const handleLiveChange = (e) => {
        const { name, value } = e.target;
        setLiveMatch(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const combinedDateTime = new Date(match.start_date || match.date);
            let s_hours = new Date(match?.date).getHours()
            let s_minutes = new Date(match?.date).getMinutes()
            const [hours, minutes] = (match?.time || `${s_hours}:${s_minutes}`).split(":");
            combinedDateTime.setHours(hours);
            combinedDateTime.setMinutes(minutes);

            const combinedEndDateTime = new Date(match.end_date || match.enddate);
            let e_hours = new Date(match?.enddate).getHours()
            let e_minutes = new Date(match?.enddate).getMinutes()
            const [endHours, endMinutes] = (match?.endTime || `${e_hours}:${e_minutes}`).split(":");
            combinedEndDateTime.setHours(endHours);
            combinedEndDateTime.setMinutes(endMinutes);

            const updatedMatch = {
                ...match,
                date: combinedDateTime.toISOString(),
                enddate: combinedEndDateTime.toISOString()
            };

            await onSave(updatedMatch);
            onClose();
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAdvancedEdit = () => {
        navigate(`/advanced-edit/${matchId}`);
    };

    if (!isOpen) return null;

    const upcomingFields = [
        { name: "matchId", label: "Match ID" },
        { name: "matchTitle", label: "Match Title" },
        { name: "seriesId", label: "Series ID" },
        { name: "teamHomeName", label: "Team Home Name" },
        { name: "teamAwayName", label: "Team Away Name" },
        { name: "teamHomeCode", label: "Team Home Code" },
        { name: "teamAwayCode", label: "Team Away Code" },
        { name: "teamHomeId", label: "Team Home ID" },
        { name: "teamAwayId", label: "Team Away ID" },
        { name: "teamHomeFlagUrl", label: "Home Flag URL" },
        { name: "teamAwayFlagUrl", label: "Away Flag URL" },

    ];

    const liveFields = [
        { name: "toss", label: "Toss Result" },
        { name: "result", label: "Update Result" },
    ];

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
                Edit Match
            </DialogTitle>

            <DialogContent dividers sx={{ backgroundColor: "#344767", color: "#fff", p: 3, position: "relative" }}>
                {loading && (
                    <Box display="flex" justifyContent="center" alignItems="center"
                        position="absolute" top={0} left={0} right={0} bottom={0}
                        bgcolor="rgba(0, 0, 0, 0.5)" zIndex={1}>
                        <CircularProgress />
                    </Box>
                )}

                <Box mb={3}>
                    <h3>Upcoming Match Details</h3>

                    {upcomingFields.map(field => (
                        <TextField
                            key={field.name}
                            label={field.label}
                            fullWidth
                            name={field.name}
                            value={match?.[field.name] || ""}
                            onChange={handleChange}
                            margin="normal"
                            sx={{ borderRadius: "5px" }}
                        />
                    ))}

                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Match Date"
                                type="date"
                                fullWidth
                                name="start_date"
                                value={match?.start_date ? new Date(match.start_date).toISOString().split("T")[0] : match?.date ? new Date(match?.date)?.toISOString().split("T")[0] : ""}
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
                                value={
                                    match?.time
                                        ? match.time
                                        : match?.date
                                            ? new Date(match.date).toISOString().split("T")[1]?.slice(0, 5)
                                            : ""
                                }
                                onChange={handleChange}
                                sx={{ borderRadius: "5px" }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Match End Date"
                                type="date"
                                fullWidth
                                name="end_date"
                                value={match?.end_date ? new Date(match.end_date).toISOString().split("T")[0] : match?.enddate ? new Date(match?.enddate).toISOString().split("T")[0] : ""}
                                onChange={handleChange}
                                sx={{ borderRadius: "5px" }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Match End Time"
                                type="time"
                                fullWidth
                                name="endTime"
                                value={
                                    match?.endTime
                                        ? match.endTime
                                        : match?.enddate
                                            ? new Date(match.enddate).toISOString().split("T")[1]?.slice(0, 5)
                                            : ""
                                }
                                onChange={handleChange}
                                sx={{ borderRadius: "5px" }}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {liveMatch && (
                    <Box>
                        <h3>Live Match Details</h3>

                        <TextField
                            select
                            label="Match Status"
                            fullWidth
                            name="status"
                            value={liveMatch?.status || ""}
                            onChange={handleLiveChange}
                            margin="normal"
                            sx={{ borderRadius: "5px" }}
                        >
                            {["Scheduled", "Upcoming", "In Progress", "Complete", "Stumps", "Break"].map((status) => (
                                <MenuItem key={status} value={status}>{status}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Is In Play"
                            fullWidth
                            name="isInPlay"
                            value={liveMatch?.isInPlay ?? ""}
                            onChange={handleLiveChange}
                            margin="normal"
                            sx={{ borderRadius: "5px" }}
                        >
                            <MenuItem value="">Select...</MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </TextField>

                        {liveFields.map(field => (
                            <TextField
                                key={field.name}
                                label={field.label}
                                fullWidth
                                name={field.name}
                                value={liveMatch?.[field.name] || ""}
                                onChange={handleLiveChange}
                                margin="normal"
                                sx={{ borderRadius: "5px" }}
                            />
                        ))}
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ backgroundColor: "#344767", p: 2 }}>
                <Button variant="outlined" onClick={onClose} sx={{ color: "#fff", borderColor: "#bbb" }}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleSave} disabled={loading}
                    sx={{ backgroundColor: "#4caf50", color: "#fff" }}>
                    Save Changes
                </Button>
                <Button variant="contained" onClick={handleAdvancedEdit}
                    sx={{ backgroundColor: "#1976d2", color: "#fff" }}>
                    Advanced Editing
                </Button>
            </DialogActions>
        </Dialog>
    );
}
