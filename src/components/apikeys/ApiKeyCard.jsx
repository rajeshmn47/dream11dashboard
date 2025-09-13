import { Card, CardContent, Typography, Chip, IconButton, Tooltip, Box, LinearProgress, TextField, Switch, Button } from "@mui/material";
import { Edit, Delete, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import ProgressLineChart from "examples/Charts/LineCharts/ProgressLineChart";
import MDProgress from "components/MDProgress";
import moment from "moment";

export default function ApiKeyCard({ apiKey, isEditing, onEdit, onDelete, onSave }) {
    const [showKey, setShowKey] = useState(false);
    const [tempStatus, setTempStatus] = useState(apiKey.status === "active");

    return (
        <Card sx={{ borderRadius: 2, boxShadow: 3, mb: 2 }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    {/* API Key */}
                    {isEditing ?
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                defaultValue={apiKey.apiKey}
                                onChange={(e) => onEdit({ ...apiKey, apiKey: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                size="small"
                                sx={{marginTop: 1.5}}
                                defaultValue={apiKey.usageCount}
                                onChange={(e) => onEdit({ ...apiKey, usageCount: e.target.value })}
                            />
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" color="#FFF">
                                    Status:
                                </Typography>
                                <Switch
                                    checked={apiKey.status === "active"}
                                    onChange={(e) => onEdit({...apiKey,status: e.target.checked ? "active" : "inactive" })}
                                    color="primary"
                                />
                                <Chip
                                    label={tempStatus ? "Active" : "Inactive"}
                                    color={tempStatus ? "success" : "error"}
                                    size="small"
                                />
                            </Box>

                            <Box gap={2} display={'flex'}>
                                <Button
                                    onClick={() => onSave({ ...apiKey })}
                                    variant="contained"
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={() => onEdit({ apiKey: "" })}
                                    variant="outlined"
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                        :
                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: "monospace",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "250px",
                                    color: "#FFF"
                                }}
                            >
                                {apiKey.apiKey}
                            </Typography>

                            {/* Toggle visibility */}
                            <Tooltip title={showKey ? "Hide Key" : "Show Key"}>
                                <IconButton size="small" onClick={() => setShowKey(!showKey)}>
                                    {showKey ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Tooltip>

                            <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
                                <Chip
                                    label={apiKey.status}
                                    color={apiKey.status === "active" ? "success" : "error"}
                                    size="small"
                                />
                                <Typography variant="caption" color="#FFF">
                                    {new Date(apiKey.updatedAt).toLocaleDateString()}
                                    {moment(apiKey.updatedAt).format("DD MMM YYYY, hh:mm A")}
                                </Typography>
                            </Box>

                            {/* Actions */}
                            <Box mt={2} display="flex" gap={1}>
                                <Tooltip title="Edit">
                                    <IconButton color="primary" onClick={() => onEdit(apiKey)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton color="error" onClick={() => onDelete(apiKey)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box mt={2}>
                                <Typography variant="body2" color="#FFF" gutterBottom>
                                    Usage: {apiKey.usageCount} / 100
                                </Typography>

                                <MDProgress
                                    variant="determinate"
                                    value={(apiKey.usageCount / 100) * 100}
                                    color={apiKey.usageCount < 80 ? "info" : apiKey.usageCount < 100 ? "warning" : "error"}
                                />
                            </Box>
                        </Box>}
                </Box>
            </CardContent>
        </Card>
    );
}
