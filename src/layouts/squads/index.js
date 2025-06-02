import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, IconButton,
  Button
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddSquadModal from "components/squads/AddSquadModal";
import EditSquadModal from "components/squads/EditSquadModal";
import axios from "axios";
import { API } from "api";
import { URL } from "constants/userconstants";
import { DashboardCustomizeTwoTone } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";

export default function SquadsPage() {
  const [squads, setSquads] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSquads = async () => {
    try {
      const res = await API.get(`${URL}/api/match/squads`);
      setSquads(res.data);
    } catch (err) {
      console.error("Failed to fetch squads", err);
    }
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  const columns = [
    { Header: "Name", accessor: "teamName", align: "left" },
    { Header: "Team Id", accessor: "teamId", align: "center" },
    { Header: "Players", accessor: "players", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const handleEdit=()=>{
    setEditOpen(!editOpen)
  }

  const rows = squads.map((data) => ({
    teamName: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.teamName}
      </MDTypography>
    ),
    image: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        <img src={`https://static.cricbuzz.com/a/img/v1/24x18/i1/c${data.image}/ida.jpg`} target="_blank" rel="noopener noreferrer" />
      </MDTypography>
    ),
    teamId: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.teamId}
      </MDTypography>
    ),
      players: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.players.map((p) => p.playerName).join(", ")}
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
          onClick={() => console.log("Reject", data._id)}
          disabled={data.status === "Rejected"}
        >
          Delete
        </Button>
      </MDBox>
    ),
  }));

  console.log(squads?.length > 0 && squads?.[0]?.players.map((p) => p.playerName), 'team')

  return (
    <DashboardLayout>
      <MDBox>
        <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <MDTypography variant="h5">Squads</MDTypography>
          <MDButton variant="gradient" color="info" onClick={() => setCreateOpen(true)}>
            <AddIcon />&nbsp;Add Squad
          </MDButton>
        </MDBox>
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
        {/* Modals */}
        <AddSquadModal open={createOpen} onClose={() => setCreateOpen(false)} onSave={fetchSquads} />
        <EditSquadModal open={editOpen} onClose={() => setEditOpen(false)} squad={selectedSquad} onSave={fetchSquads} />
      </MDBox>
    </DashboardLayout>
  );
}
