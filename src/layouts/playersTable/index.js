import React, { useEffect, useState } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, Box, CircularProgress } from "@mui/material";
import AddPlayerModal from "components/players/AddPlayerModal";
import EditPlayerModal from "components/players/EditPlayerModal";
import axios from "axios";
import { API } from "api";
import { URL } from "constants/userconstants";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ConfirmDialog from "components/ConfirmDeteteDialog";

const PlayerTable = () => {
    const [players, setPlayers] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const rows = filteredPlayers.map((data) => ({
        user: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {data.name}
            </MDTypography>
        ),
        image: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                <img src={`https://static.cricbuzz.com/a/img/v1/24x18/i1/c${data.image}/ida.jpg`} target="_blank" rel="noopener noreferrer" />
            </MDTypography>
        ),
        document: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                India
            </MDTypography>
        ),
        teamId: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {data.teamId}
            </MDTypography>
        ),
        action: (
            <MDBox display="flex" justifyContent="center" gap={1}>
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleEdit(data)}
                    disabled={data.status === "Approved"}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(data)}
                    disabled={data.status === "Rejected"}
                >
                    Delete
                </Button>
            </MDBox>
        ),
    }));

    useEffect(() => {
        fetchPlayers();
    }, []);

    useEffect(() => {
        if (!search && players.length > 0) {
            setFilteredPlayers([...players]);
        } else {
            if (search && rows?.length > 0) {
                const lower = search.toLowerCase();
                const filtered = players.filter((row) => {
                    console.log(Object.values(row), 'row')
                    return Object.values(row).some(
                        (value) => value && String(value).toLowerCase().includes(lower)
                    )
                }
                );
                setFilteredPlayers([...filtered]);
            }
        }
    }, [search, players]);

    const fetchPlayers = async () => {
        setLoading(true);
        const res = await API.get(`${URL}/player/all`);
        setPlayers(res.data);
        setLoading(false)
    };

    const handleDelete = (player) => {
        setSelectedPlayer(player);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async (id) => {
        await API.delete(`${URL}/player/delete/${id}`);
        fetchPlayers();
    };

    const columns = [
        { Header: "Name", accessor: "user", align: "left" },
        { Header: "Image", accessor: "image", align: "center" },
        { Header: "Team", accessor: "document", align: "center" },
        { Header: "Team Id", accessor: "teamId", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    const handleEdit = (player) => {
        setSelectedPlayer(player)
        setEditOpen(!editOpen)
    }

    return (
        <>
            <DashboardLayout>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <TextField
                        label="Search players"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginBottom: 16 }}
                    />
                    <Button variant="contained" onClick={() => setAddOpen(true)}>Add Player</Button>
                </div>
                <MDBox pt={3}>
                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                            <CircularProgress />
                        </Box>
                    ) : (
                        <DataTable
                            table={{ columns, rows }}
                            isSorted={true}
                            entriesPerPage={false}
                            showTotalEntries={false}
                            noEndBorder
                            loading={loading}
                        />)}
                </MDBox>
                <AddPlayerModal open={addOpen} onClose={() => setAddOpen(false)} refresh={fetchPlayers} />
                {selectedPlayer &&
                    <EditPlayerModal
                        open={editOpen}
                        onClose={() => setEditOpen(false)}
                        player={selectedPlayer}
                        refresh={fetchPlayers}
                    />}
                <ConfirmDialog
                    open={deleteDialogOpen}
                    title="Delete User"
                    content={`Are you sure you want to delete user ${selectedPlayer?.name}?`}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                />
            </DashboardLayout>
        </>
    );
};

export default PlayerTable;
