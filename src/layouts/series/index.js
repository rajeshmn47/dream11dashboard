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
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from "@mui/material";
import AddSeriesModal from "components/series/AddSeriesModal";
import EditSeriesModal from "components/series/EditSeriesModal";
import DataTable from "examples/Tables/DataTable";
import ConfirmDialog from "components/ConfirmDeteteDialog";
import SeriesScheduleModal from "components/series/SeriesScheduleModal";

function SeriesList() {
  const [createOpen, setCreateOpen] = useState(false);
  const [seriesName, setSeriesName] = useState("");
  const [seriesList, setSeriesList] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleSeries, setScheduleSeries] = useState(null);

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

  useEffect(() => {
    if (!search && seriesList.length > 0) {
      setFilteredSeries([...seriesList]);
    } else {
      if (search && rows?.length > 0) {
        const lower = search.toLowerCase();
        const filtered = seriesList.filter((row) => {
          console.log(Object.values(row), 'row')
          return Object.values(row).some(
            (value) => value && String(value).toLowerCase().includes(lower)
          )
        }
        );
        setFilteredSeries([...filtered]);
      }
    }
  }, [search, seriesList]);

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

  const handleDelete = (series) => {
    setSelectedSeries(series);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`${URL}/api/match/series/${selectedSeries?.seriesId}`);
      fetchSeries(); // refresh list after deletion
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete series", error);
    }
  };

  const rows = filteredSeries.map((s, i) => ({
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
    seriesId: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {s.seriesId}
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
          color="info"
          size="small"
          onClick={() => { setScheduleSeries(s); setScheduleModalOpen(true); }}
        >
          View Schedule
        </Button>
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
          onClick={() => handleDelete(s)}
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
    { Header: "Series ID", accessor: "seriesId", align: "center" },
    { Header: "Date", accessor: "date", align: "center" },
    { Header: "Start Date", accessor: "startDate", align: "center" },
    { Header: "End Date", accessor: "endDate", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <TextField
          label="Search series"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 16 }}
        />
      </div>
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
                isSorted={true}
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
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Series"
          content={`Are you sure you want to delete series ${selectedSeries?.name}?`}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
        />
        <SeriesScheduleModal
          open={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          series={scheduleSeries}
        />
      </MDBox>
    </DashboardLayout>
  );
}

export default SeriesList;
