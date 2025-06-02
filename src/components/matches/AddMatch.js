import React, { useState } from "react";
import {
    Modal,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
} from "@mui/material";
import axios from "axios"; // Optional: Use your own API utility if needed
import { URL } from "constants/userconstants";
import { API } from "api";
import { useEffect } from "react";

// Set this in your .env file

const AddMatch = ({ open, onClose, getMatches }) => {
    const [newMatch, setNewMatch] = useState({
        matchId: "",
        matchTitle: "",
        seriesId: "",
        teamHomeName: "",
        teamAwayName: "",
        teamHomeCode: "",
        teamAwayCode: "",
        teamHomeId: "",
        teamAwayId: "",
        teamHomeFlagUrl: "",
        teamAwayFlagUrl: "",
        date: "",
        enddate: "",
        format: "",
        type: "",
    });

    const [seriesList, setSeriesList] = useState([]);

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


    const handleInputChange = (name, value) => {
        setNewMatch((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async () => {
        try {
            await API.post(`${URL}/api/match/series/create`, newMatch);
            onClose();
            getMatches(); // Refresh match list
        } catch (error) {
            console.error("Error creating match:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    backgroundColor: "#344767"
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Create Match
                </Typography>

                 <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Series</InputLabel>
                    <Select
                        value={newMatch.seriesId}
                        label="Series"
                        onChange={(e) => handleInputChange("seriesId", e.target.value)}
                        sx={{
                            borderRadius: "5px",
                            "& .MuiInputBase-root": { height: "50px" },
                            "& .MuiSelect-select": { padding: "14px", minHeight: "50px" },
                        }}
                    >
                        {seriesList.map((series) => (
                            <MenuItem key={series._id} value={series._id}>
                                {series.name} {/* Adjust based on your schema */}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {[
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
                ].map(({ name, label }) => (
                    <TextField
                        key={name}
                        fullWidth
                        margin="dense"
                        name={name}
                        label={label}
                        value={newMatch[name]}
                        onChange={(e) => handleInputChange(name, e.target.value)}
                    />
                ))}

                <TextField
                    fullWidth
                    margin="dense"
                    type="datetime-local"
                    label="Match Start"
                    InputLabelProps={{ shrink: true }}
                    value={newMatch.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="dense"
                    type="datetime-local"
                    label="Match End"
                    InputLabelProps={{ shrink: true }}
                    value={newMatch.enddate}
                    onChange={(e) => handleInputChange("enddate", e.target.value)}
                />


                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Format</InputLabel>
                    <Select
                        value={newMatch.format}
                        label="Format"
                        onChange={(e) => handleInputChange("format", e.target.value)}
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
                        <MenuItem value="t20">T20</MenuItem>
                        <MenuItem value="odi">ODI</MenuItem>
                        <MenuItem value="test">Test</MenuItem>
                        <MenuItem value="t10">T10</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                        value={newMatch.type}
                        label="Type"
                        onChange={(e) => handleInputChange("type", e.target.value)}
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
                        <MenuItem value="i">International</MenuItem>
                        <MenuItem value="d">Domestic</MenuItem>
                        <MenuItem value="l">League</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={handleCreate}
                >
                    Create Match
                </Button>
            </Box>
        </Modal>
    );
};

export default AddMatch;
