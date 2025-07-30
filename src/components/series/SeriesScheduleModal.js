import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { API } from "api";
import { URL } from "constants/userconstants";
import DataTable from "examples/Tables/DataTable";

export default function SeriesScheduleModal({ open, onClose, series }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchMatches = async () => {
            if (!series) return;
            setLoading(true);
            try {
                // Use a dedicated endpoint if available, else filter client-side
                const res = await API.get(`${URL}/api/match/series/${series.seriesId}/matches`);
                setMatches(res.data || []);
            } catch (err) {
                setMatches([]);
            } finally {
                setLoading(false);
            }
        };
        if (open) fetchMatches();
    }, [open, series]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Match Schedule for {series?.name || series?.seriesName}</DialogTitle>
            <DialogContent>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 24 }}><span>Loading...</span></div>
                ) : (
                    <DataTable
                        table={{
                            columns: [
                                { Header: "#", accessor: "index", align: "center" },
                                { Header: "Match Title", accessor: "matchTitle", align: "left" },
                                { Header: "Date", accessor: "date", align: "center" },
                                { Header: "Teams", accessor: "teams", align: "center" },
                            ],
                            rows: matches.length === 0 ? [] : matches.map((m, idx) => ({
                                index: idx + 1,
                                matchTitle: m.matchTitle || m.title,
                                date: m.date ? new Date(m.date).toLocaleString() : "N/A",
                                teams: `${m.teamHomeName} vs ${m.teamAwayName}`,
                            })),
                        }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}
