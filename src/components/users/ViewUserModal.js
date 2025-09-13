import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    Typography,
    Avatar,
    Chip,
    Divider,
    Box,
    List,
    ListItem,
    ListItemText,
    Collapse,
    IconButton,
} from "@mui/material";
import { API } from "api";
import { URL } from "constants/userconstants";
import moment from "moment";
import { useState } from "react";

export default function ViewUserModal({ open, onClose, userData }) {
    const [matches, setMatches] = useState([]);
    const [showMatches, setShowMatches] = useState(false);
    const [expandedMatches, setExpandedMatches] = useState({});

    if (!userData) return null;

    const toggleExpand = (matchId) => {
        setExpandedMatches((prev) => ({ ...prev, [matchId]: !prev[matchId] }));
    };

    if (!userData) return null;

    const fetchMatches = async () => {
        try {
            const res = await API.get(`${URL}/admin/users/${userData._id}/matches`);
            setMatches(res.data.matches);
            setShowMatches(true);
        } catch (err) {
            console.error("Error fetching matches:", err);
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* Header */}
            <DialogTitle
                sx={{
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    p: 3,
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                }}
            >
                User Details
            </DialogTitle>

            {/* Content */}
            <DialogContent
                sx={{
                    backgroundColor: "#0f172a",
                    color: "#e2e8f0",
                    p: 3,
                    fontFamily: "Inter, sans-serif",
                }}
            >
                <Grid container spacing={2} mt={1}>
                    {/* Avatar + Name */}
                    <Grid item xs={12} display="flex" alignItems="center" gap={2}>
                        <Avatar
                            sx={{
                                bgcolor: "primary.main",
                                width: 64,
                                height: 64,
                                fontSize: "1.5rem",
                                fontWeight: 600,
                            }}
                            src={userData.image}
                        >
                            {userData.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, fontFamily: "Poppins, sans-serif" }}
                            >
                                {userData.username}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                            >
                                {userData.email}
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    </Grid>

                    {/* Basic Info */}
                    <Grid item xs={6}>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                        >
                            Role
                        </Typography>
                        <Chip
                            label={userData.role || "user"}
                            color={userData.role === "admin" ? "secondary" : "default"}
                            size="small"
                            sx={{ mt: 0.5, fontFamily: "Inter, sans-serif" }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                        >
                            Created At
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontFamily: "Inter, sans-serif" }}
                        >
                            {new Date(userData.createdAt).toLocaleString()}
                        </Typography>
                    </Grid>

                    {/* Address Info */}
                    <Grid item xs={12}>
                        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                        >
                            Country
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontFamily: "Poppins, sans-serif" }}
                        >
                            {userData.country || "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                        >
                            State
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontFamily: "Poppins, sans-serif" }}
                        >
                            {userData.state || "-"}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="subtitle2"
                            sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                        >
                            City
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, fontFamily: "Poppins, sans-serif" }}
                        >
                            {userData.city || "-"}
                        </Typography>
                    </Grid>

                    {/* Stats */}
                    {[
                        { label: "Contests Joined", value: userData.numberOfContestJoined },
                        { label: "Contests Won", value: userData.numberOfContestWon },
                        { label: "Teams Created", value: userData.numberOfTeamsCreated },
                        { label: "Amount Won", value: `₹${userData.totalAmountWon}` },
                        { label: "Wallet Balance", value: `₹${userData.wallet}` },
                        { label: "Amount Added", value: `₹${userData.totalAmountAdded}` },
                    ].map((item, i) => (
                        <Grid item xs={6} key={i}>
                            <Typography
                                variant="subtitle2"
                                sx={{ color: "#94a3b8", fontFamily: "Inter, sans-serif" }}
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: 600,
                                    fontFamily: "Poppins, sans-serif",
                                    color: "#f1f5f9",
                                }}
                            >
                                {item.value}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={fetchMatches}
                    sx={{ mt: 2, mb: 2 }}
                >
                    Show Matches Joined
                </Button>
                
                <Box mt={2}>
                    <Typography variant="subtitle1" mb={1}>
                        Matches Joined:
                    </Typography>
                    {matches.map((match) => (
                        <Box
                            key={match._id}
                            mb={1}
                            p={1}
                            sx={{ backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 1 }}
                        >
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                onClick={() => toggleExpand(match._id)}
                                sx={{ cursor: "pointer", flexWrap: "wrap", gap: 1 }}
                            >
                                <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {match.matchTitle}
                                </Typography>
                                <Typography variant="caption" color="gray" sx={{ flexShrink: 0 }}>
                                    {moment(match.date).format("DD-MMM-YYYY")} | {match.format.toUpperCase()}
                                </Typography>
                                <IconButton size="small">
                                    {expandedMatches[match._id] ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Box>

                            <Collapse in={expandedMatches[match._id]} timeout="auto" unmountOnExit>
                                <Box sx={{ mt: 1, pl: 1 }}>
                                    {/* Teams Created */}
                                    <Typography variant="subtitle2" mb={0.5}>
                                        Teams Created: {match.teams?.length || 0}
                                    </Typography>
                                    {match.teams?.length ? (
                                        match.teams.map((team) => (
                                            <Typography
                                                key={team._id}
                                                variant="body2"
                                                sx={{ pl: 1, wordBreak: 'break-word', mb: 0.5 }}
                                            >
                                                {team.teamName || `Team ID: ${team._id}`} | Points: {team.points || 0}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2" sx={{ pl: 1 }}>
                                            No teams created
                                        </Typography>
                                    )}

                                    <Divider sx={{ my: 1, borderColor: "rgba(255,255,255,0.2)" }} />

                                    {/* Contests Joined */}
                                    <Typography variant="subtitle2" mb={0.5}>
                                        Contests Joined: {match.contests?.length || 0}
                                    </Typography>
                                    {match.contests?.length ? (
                                        match.contests.map((contest) => (
                                            <Typography
                                                key={contest._id}
                                                variant="body2"
                                                sx={{ pl: 1, wordBreak: 'break-word', mb: 0.5 }}
                                            >
                                                {contest.contestName
                                                    ? contest.contestName
                                                    : `Contest ₹${contest.price} / ${contest.totalSpots} spots`} | Prize: ₹{contest.userPrize || 0}
                                            </Typography>
                                        ))
                                    ) : (
                                        <Typography variant="body2" sx={{ pl: 1 }}>
                                            No contests joined
                                        </Typography>
                                    )}
                                </Box>
                            </Collapse>
                        </Box>
                    ))}
                </Box>

            </DialogContent>

            {/* Footer */}
            <DialogActions
                sx={{
                    backgroundColor: "#1e293b",
                    color: "#fff",
                    p: 3,
                }}
            >
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="secondary"
                    sx={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
