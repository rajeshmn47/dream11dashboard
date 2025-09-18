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
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, MenuItem, Menu, Tooltip } from "@mui/material";
import AddSeriesModal from "components/series/AddSeriesModal";
import EditSeriesModal from "components/series/EditSeriesModal";
import DataTable from "examples/Tables/DataTable";
import ConfirmDialog from "components/ConfirmDeteteDialog";
import SeriesScheduleModal from "components/series/SeriesScheduleModal";
import useNotification from "hooks/useComponent";
import { ArrowDropDown } from "@mui/icons-material";

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
  const { showNotification, NotificationComponent } = useNotification();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [successSB, setSuccessSB] = useState(false);
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const statusOpen = Boolean(statusAnchorEl)
  const statusOptions = [
    { value: 'all', label: 'All Matches' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' }
  ];

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

  const currentDate = new Date();

  const filteredMatches = filteredSeries.filter(match => {
    const matchDate = new Date(match.date);
    const matchEndDate = new Date(match.endDate);

    // 1️⃣ Status filter
    let statusPass = false;
    if (selectedFilter === 'all') {
      statusPass = true;
    } else if (selectedFilter === 'ongoing') {
      statusPass = matchDate <= currentDate && matchEndDate >= currentDate;
    } else if (selectedFilter === 'upcoming') {
      statusPass = matchDate > currentDate;
    } else if (selectedFilter === 'completed') {
      statusPass = matchEndDate < currentDate;
    } else if (selectedFilter === 'delayedOrAbandoned') {
      const result = match.matchlive?.[0]?.result?.toLowerCase();
      statusPass = result === 'delayed' || result === 'abandon';
    }

    // 2️⃣ Importance filter
    let importancePass = false;
    if (importanceFilter === 'all') {
      importancePass = true;
    } else {
      importancePass = match?.importance === importanceFilter;
    }

    // ✅ Must satisfy BOTH
    return statusPass && importancePass;
  });

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
      showNotification({
        color: "success",
        icon: "check",
        title: "Series Updated successfully!"
      });
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
      showNotification({
        color: "success",
        icon: "check",
        title: "Series deleted successfully!"
      });
    } catch (error) {
      console.error("Failed to delete series", error);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(matchId => matchId !== id)
        : [...prev, id]
    );
  };

  const handleSelectImportance = (value) => {
    setImportanceFilter(value);
    handleClose();
  };

  const handleStatusClose = () => {
    setStatusAnchorEl(null);
  }

  const handleStatusSelect = (value) => {
    setSelectedFilter(value)
    handleClose();
  };

  const handleSelectedUpdate = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      console.log(selectedIds, 'selected ids')
      for (let i = 0; i < selectedIds?.length; i++) {
        await API.get(`${URL}/api/match/update_to_live/${selectedIds[i]}`);
        await API.get(`${URL}/api/match/update_live_scores/${selectedIds[i]}`);
      }
      setSelectedIds([]); // Clear selection
      fetchSeries(); // Refresh data
      setLoading(false)
    } catch (err) {
      console.error("Batch update failed", err);
    }
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null);

  const rows = filteredMatches.map((s, i) => ({
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

  console.log(filteredMatches, filteredSeries, 'series')

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={1}>
        <MDBox>
          <MDBox>
            <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <MDBox>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <TextField
                    label="Search series"
                    variant="outlined"
                    size="small"
                    sx={{ borderColor: "#344767" }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ marginBottom: 16 }}
                  />
                </div>
              </MDBox>
              <MDBox display="flex" gap={2}>
                <MDBox>
                  <Tooltip title="Filter matches by status">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleStatusClick}
                      endIcon={<ArrowDropDown />}
                      sx={{ textTransform: "none", minWidth: 180, fontWeight: "medium", color: "#FFF !important" }}
                    >
                      Status: {statusOptions.find(o => o.value === selectedFilter)?.label || 'All Matches'}
                    </Button>
                  </Tooltip>

                  <Menu anchorEl={statusAnchorEl} open={statusOpen} onClose={handleStatusClose}>
                    {statusOptions.map(option => (
                      <MenuItem
                        key={option.value}
                        selected={selectedFilter === option.value}
                        onClick={() => {
                          handleStatusSelect(option.value);
                          handleStatusClose();
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Menu>
                </MDBox>
                <MDBox>
                  <Tooltip title="Filter by importance">
                    <Button
                      variant="outlined"
                      onClick={handleClick}
                      endIcon={<ArrowDropDown />}
                      sx={{ textTransform: "none", minWidth: 160, fontWeight: "medium", color: "#FFF !important" }}
                    >
                      Importance: {(importanceFilter || "all") === "all" ? "All" : (importanceFilter || "").replace("_", " ").toUpperCase()}
                    </Button>
                  </Tooltip>
                  <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                    {["all", "very_high", "high", "medium", "low"].map((level) => (
                      <MenuItem key={level} onClick={() => handleSelectImportance(level)}>
                        {level === "all" ? "All" : level.replace("_", " ").toUpperCase()}
                      </MenuItem>
                    ))}
                  </Menu>
                </MDBox>
                <MDButton variant="gradient" color="info" onClick={() => setCreateOpen(true)}>
                  Add Series
                </MDButton>
              </MDBox>
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
      <NotificationComponent />
    </DashboardLayout >
  );
}

export default SeriesList;
