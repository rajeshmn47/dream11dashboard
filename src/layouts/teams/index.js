import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API } from "api";
import { URL } from "constants/userconstants";
import Dashboard from "layouts/dashboard";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import { Button } from "@mui/material";
import MDTypography from "components/MDTypography";
import TeamModal from "components/teams/AddTeamModal";

export default function TeamList() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editTeam, setEditTeam] = useState(null);

    const handleEdit = (team) => {
        setEditTeam(team);
        setModalOpen(true);
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        const res = await API.get(`${URL}/api/match/team/all`);
        setTeams(res.data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this team?")) {
            await API.delete(`${URL}/api/match/team/${id}`);
            fetchTeams();
        }
    };

    const columns = [
        { Header: "Name", accessor: "teamName", align: "left" },
        { Header: "Team", accessor: "shortName", align: "center" },
        { Header: "Image", accessor: "image", align: "center" },
        { Header: "Team Id", accessor: "teamId", align: "center" },
        { Header: "Action", accessor: "action", align: "center" },
    ];

    const rows = teams.map((data) => ({
        teamName: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {data.teamName}
            </MDTypography>
        ),
        shortName: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {data.shortName}
            </MDTypography>
        ),
        image: (
            <img src={`https://static.cricbuzz.com/a/img/v1/24x18/i1/c${data.image}/ida.jpg`} target="_blank" rel="noopener noreferrer" />
        ),
        teamId: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
                {data.id}
            </MDTypography>
        ),
        action: (
            <MDBox display="flex" justifyContent="center" gap={1}>
                <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => console.log("Approve", data._id)}
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

    return (
        <DashboardLayout>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <h1 className="text-2xl font-bold">Cricket Teams</h1>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        setEditTeam(null);
                        setModalOpen(true);
                    }}
                >
                    + Add Team
                </Button>
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
            <TeamModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={fetchTeams}
                editData={editTeam}
            />
        </DashboardLayout>
    );
}
