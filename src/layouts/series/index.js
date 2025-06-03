import React, { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import axios from "axios";
import { API } from "api";
import { URL } from "constants/userconstants";
import { useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import AddSeriesModal from "components/series/AddSeriesModal";
import EditSeriesModal from "components/series/EditSeriesModal";
import DataTable from "examples/Tables/DataTable";

function SeriesList() {
  const [createOpen, setCreateOpen] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch all series on mount
  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await API.get(`${URL}/api/match/series/all`); // Change to your actual endpoint
      setSeriesList(res.data);
    } catch (err) {
      console.error("Error fetching series:", err);
    }
  };

  const handleAddSeries = (e) => {
    e.preventDefault();
    if (!seriesName.trim()) return;

    // Simulate adding series
    setSeriesList((prev) => [...prev, { name: seriesName }]);
    setSeriesName("");
  };

  const handleSelectSeries = async (series) => {
    setSelectedSeries(series);       // your state
    setEditModalOpen(true);          // open your EditSeries modal
  };

  const handleEditSeries = async (series) => {         // open your EditSeries modal
    try {
      await API.put(`${URL}/api/match/series/${selectedSeries?.seriesId}`, { ...series });
      fetchSeries(); // refresh list after deletion
    } catch (error) {
      console.error("Failed to delete series", error);
    }
  };

  const handleDeleteSeries = async (seriesId) => {
    try {
      await API.delete(`/api/match/series/${seriesId}`);
      fetchSeries(); // refresh list after deletion
    } catch (error) {
      console.error("Failed to delete series", error);
    }
  };

  const rows = seriesList.map((s, i) => ({
    index: i + 1,
    name: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {s.name}
      </MDTypography>
    ),
    type: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {s.type}
      </MDTypography>
    ),
    date: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {s.date}
      </MDTypography>
    ),
    startDate: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {s.startDate ? new Date(s.startDate).toLocaleDateString() : "N/A"}
      </MDTypography>
    ),
    endDate: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {s.endDate ? new Date(s.endDate).toLocaleDateString() : "N/A"}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" gap={1}>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleSelectSeries(s)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteSeries(s.seriesId)}
        >
          Delete
        </Button>
      </MDBox>
    ),
  }));

  const columns = [
    { Header: "#", accessor: "index", align: "center" },
    { Header: "Series Name", accessor: "name", align: "left" },
    { Header: "Type", accessor: "type", align: "center" },
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Start Date", accessor: "startDate", align: "center" },
    { Header: "End Date", accessor: "endDate", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDBox>
          <MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <MDTypography variant="h5">Series</MDTypography>
              <MDButton variant="gradient" color="info" onClick={() => setCreateOpen(true)}>
                Add Series
              </MDButton>
            </MDBox>
            <MDBox pt={3}>
              <DataTable
                table={{ columns, rows }}
                isSorted={false}
                entriesPerPage={false}
                showTotalEntries={false}
                noEndBorder
              />
            </MDBox>
          </MDBox>
        </MDBox>
        <AddSeriesModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          getSeries={fetchSeries}
        />
        <EditSeriesModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          seriesData={selectedSeries}
          onSave={handleEditSeries}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default SeriesList;
