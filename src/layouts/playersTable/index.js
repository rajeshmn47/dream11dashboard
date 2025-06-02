import React, { useEffect, useState } from "react";
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import AddPlayerModal from "components/players/AddPlayerModal";
import EditPlayerModal from "components/players/EditPlayerModal";
import axios from "axios";
import { API } from "api";
import { URL } from "constants/userconstants";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PlayerTable = () => {
    const [players, setPlayers] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchPlayers = async () => {
        const res = await API.get(`${URL}/player/all`);
        setPlayers(res.data);
    };

    const handleDelete = async (id) => {
        await API.delete(`${URL}/player/delete/${id}`);
        fetchPlayers();
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

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

    const rows = players.map((data) => ({
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
                    onClick={() => console.log("Approve", data._id)}
                    disabled={data.status === "Rejected"}
                >
                    Delete
                </Button>
            </MDBox>
        ),
    }));

    return (
        <>
            <DashboardLayout>
                <Button variant="contained" onClick={() => setAddOpen(true)}>Add Player</Button>
                <MDBox pt={3}>
                    <DataTable
                        table={{ columns, rows }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={false}
                        noEndBorder
                        loading={loading}
                    />
                </MDBox>
                <AddPlayerModal open={addOpen} onClose={() => setAddOpen(false)} refresh={fetchPlayers} />
                <EditPlayerModal
                    open={editOpen}
                    onClose={() => setEditOpen(false)}
                    player={selectedPlayer}
                    refresh={fetchPlayers}
                />
            </DashboardLayout>
        </>
    );
};

export default PlayerTable;
