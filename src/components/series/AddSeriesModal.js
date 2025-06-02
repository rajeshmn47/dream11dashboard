import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
} from "@mui/material";
import axios from "axios";
import { AirportShuttle } from "@mui/icons-material";
import { API } from "api";
import { URL } from "constants/userconstants";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 420,
    bgcolor: "background.paper",
    backgroundColor: "#344767",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const AddSeriesModal = ({ open, onClose, getSeries }) => {
    const [form, setForm] = useState({
        seriesId: "",
        name: "",
        type: "international",
        date: "",
        startDate: "",
        endDate: "",
    });

    const handleChange = (field) => (e) => {
        setForm({ ...form, [field]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await API.post(`${URL}/api/match/series/create`, {
                ...form,
                seriesId: Number(form.seriesId),
                startDate: new Date(form.startDate),
                endDate: new Date(form.endDate),
            });
            getSeries(); // Refresh list
            onClose(); // Close modal
        } catch (err) {
            console.error("Error adding series:", err);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" mb={2}>
                    Add New Series
                </Typography>

                <TextField
                    fullWidth
                    label="Series ID"
                    value={form.seriesId}
                    onChange={handleChange("seriesId")}
                    type="number"
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Series Name"
                    value={form.name}
                    onChange={handleChange("name")}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    select
                    label="Type"
                    value={form.type}
                    onChange={handleChange("type")}
                    margin="normal"
                >
                    <MenuItem value="international">International</MenuItem>
                    <MenuItem value="league">League</MenuItem>
                    <MenuItem value="domestic">Domestic</MenuItem>
                    <MenuItem value="women">Women</MenuItem>
                </TextField>

                <TextField
                    fullWidth
                    label="Display Date"
                    value={form.date}
                    onChange={handleChange("date")}
                    margin="normal"
                />

                <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={form.startDate}
                    onChange={handleChange("startDate")}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    fullWidth
                    label="End Date"
                    type="date"
                    value={form.endDate}
                    onChange={handleChange("endDate")}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />

                <Box mt={3} display="flex" justifyContent="flex-end" gap={1}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add Series
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddSeriesModal;
