import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Stack,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";

const typeOptions = ["international", "league", "domestic", "women"];

const EditSeriesModal = ({ isOpen, onClose, seriesData, onSave }) => {
    const [form, setForm] = useState({
        name: "",
        type: "international",
        date: "",
        startDate: "",
        endDate: "",
        important: false,
        notImportant: false,
        importance: "medium"
    });

    useEffect(() => {
        if (seriesData) {
            setForm({
                name: seriesData.name || "",
                type: seriesData.type || "international",
                date: seriesData.date || "",
                startDate: seriesData.startDate?.slice(0, 10) || "",
                endDate: seriesData.endDate?.slice(0, 10) || "",
                important: seriesData.important || false,
                notImportant: seriesData.notImportant || false,
                importance: seriesData.importance || "medium"
            });
        }
    }, [seriesData]);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        if (!form.name || !form.type || !form.date || !form.startDate || !form.endDate) return;
        console.log("Form data before saving:", form);
        console.log("Saving series data:", form, { seriesData, ...form });
        const data = { ...seriesData, ...form };
        console.log("Data to be saved:", data);
        onSave(form);
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Edit Series</DialogTitle>
            <DialogContent sx={{ backgroundColor: "#344767" }}>
                <Stack spacing={2} mt={1}>
                    <TextField
                        name="name"
                        label="Series Name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="type"
                        label="Type"
                        value={form.type}
                        onChange={handleChange}
                        fullWidth
                        select
                        sx={{
                            borderRadius: "5px",
                            "& .MuiInputBase-root": { height: "3em !important" },
                            "& .MuiSelect-select": { padding: "14px", minHeight: "50px" },
                        }}
                    >
                        {typeOptions.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        name="date"
                        label="Date"
                        value={form.date}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="startDate"
                        label="Start Date"
                        type="date"
                        value={form.startDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <TextField
                        name="endDate"
                        label="End Date"
                        type="date"
                        value={form.endDate}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Importance</InputLabel>
                        <Select
                            value={form?.importance ?? ""}
                            label="Importance"
                            name="importance"
                            onChange={handleChange}
                            sx={{
                                borderRadius: "5px",
                                marginBottom: "16px",
                                "& .MuiInputBase-root": { height: "50px !important" },
                                "& .MuiSelect-select": { padding: "14px", minHeight: "50px !important" },
                            }}
                        >
                            <MenuItem value="">Select...</MenuItem>
                            <MenuItem value="very_high">Very High</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditSeriesModal;
