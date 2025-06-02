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
      await API.put(`${URL}/api/match/series/${selectedSeries?.seriesId}`,{...series});
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <MDTypography variant="h4" mb={2}>
          Series
        </MDTypography>

        {/* Add Series Form */}
        <MDBox component="form" onSubmit={handleAddSeries} display="flex" gap={2} mb={4}>

          <Button variant="contained" style={{ float: "right" }} onClick={() => setCreateOpen(true)}>
            Add Series
          </Button>

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

        {/* Series Table/List */}
        {seriesList.length > 0 ? (
          <MDBox>
            <TableContainer sx={{ width: "100%", mb: 3 }} component={Paper}>
              <Table sx={{ tableLayout: "fixed", width: "100%", color: "#FFF" }}>
                <TableHead sx={{ width: "100vw" }}>
                  <TableRow sx={{ width: "100%" }}>
                    <TableCell sx={{ width: "40px" }}>#</TableCell>
                    <TableCell sx={{ width: "30%" }}>Series Name</TableCell>
                    <TableCell sx={{ width: "15%" }}>Type</TableCell>
                    <TableCell sx={{ width: "10%" }}>Date</TableCell>
                    <TableCell sx={{ width: "15%" }}>Start Date</TableCell>
                    <TableCell sx={{ width: "15%" }}>End Date</TableCell>
                    <TableCell sx={{ width: "100px" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody style={{ color: "#fff" }}>
                  {seriesList.map((s, i) => (
                    <TableRow key={s.seriesId || i}>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.type}</TableCell>
                      <TableCell>{s.date}</TableCell>
                      <TableCell>{s.startDate ? new Date(s.startDate).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>{s.endDate ? new Date(s.endDate).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleSelectSeries(s)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSeries(s.seriesId)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </MDBox>
        ) : (
          <MDTypography variant="body2" color="text">
            No series added yet.
          </MDTypography>
        )}
      </MDBox>
    </DashboardLayout>
  );
}

export default SeriesList;
