import { useEffect, useMemo, useState } from "react";
import { Box, CircularProgress, Button, Card, Grid, FormControl, InputLabel, Select, MenuItem, Menu, Tooltip } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { API } from "api";
import { URL } from "constants/userconstants";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import matchesTableData from "layouts/tables/data/matchesTableData";
import EditMatchModal from "components/matches/EditMatch";
import AddMatch from "components/matches/AddMatch";
import ConfirmDialog from "components/ConfirmDeteteDialog";
import NotificationItem from "examples/Items/NotificationItem";
import MDSnackbar from "components/MDSnackbar";
import useNotification from "hooks/useComponent";
import { ArrowDropDown } from "@mui/icons-material";

const FlagImg = styled.img`
  width: 25px;
  margin: 0 5px;
`;
const Teams = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;
const GreenMark = styled.span`
  background-color: var(--green);
  height: 10px;
  width: 10px;
  border-radius: 50%;
  display: block;
  margin-right: 6px;
`;
const TeamName = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  @media (max-width: 600px) {
    display: none;
  }
`;
const TeamCode = styled.p`
  text-overflow: ellipsis;
  overflow: hidden;
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
`;
const Status = styled.p`
  white-space: nowrap;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

const HighlightedButton = styled(Button)`
  background-color: red !important;
  color: white !important;
`;

const StatusButton = styled(Button)`
  color: white !important;
`;

function Matches() {
  const navigate = useNavigate();
  const [allMatches, setAllMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('notUpdated');
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({
    matchId: "",
    teamHomeName: "",
    teamAwayName: "",
    teamHomeCode: "",
    teamAwayCode: "",
    teamHomeId: "",
    teamAwayId: "",
    teamHomeFlagUrl: "",
    teamAwayFlagUrl: "",
    format: "t20",
    type: "i",
    date: "",
    enddate: "",
    matchTitle: "",
    seriesId: "",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [successSB, setSuccessSB] = useState(false);
  const { showNotification, NotificationComponent } = useNotification();
  const [importanceFilter, setImportanceFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const statusOpen = Boolean(statusAnchorEl)
  const statusOptions = [
    { value: 'all', label: 'All Matches' },
    { value: 'notUpdated', label: 'Not Updated' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'completed', label: 'Completed' },
    { value: 'delayedOrAbandoned', label: 'Delayed or Abandoned' },
  ];

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null);

  const openSuccessSB = () => {
    setSuccessSB(true)
    setTimeout(() => {
      setSuccessSB(false);
    }, 4000);
  }

  const closeSuccessSB = () => setSuccessSB(false);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await API.get(`${URL}/api/match/series/all`);
        setSeriesList(response.data); // Adjust based on your actual response structure
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchSeries();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await API.get(`${URL}/api/match/team/all`);
        setTeamsList(response.data); // Adjust based on your actual response structure
      } catch (error) {
        console.error("Error fetching series:", error);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    setLoading(true);
    try {
      const response = await API.get(`${URL}/allmatches`);
      setAllMatches(response.data.matches || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setLoading(false);
    }
  }

  const filterMatches = (status) => {
    setSelectedFilter(status);
  };

  const currentDate = new Date();

  const filteredMatchess = selectedFilter === 'all'
    ? allMatches
    : allMatches.filter(match => {
      const matchDate = new Date(match.date);
      const matchEndDate = new Date(match.enddate);
      if (selectedFilter === 'ongoing') {
        return matchDate <= currentDate && matchEndDate >= currentDate;
      } else if (selectedFilter === 'upcoming') {
        return matchDate > currentDate;
      } else if (selectedFilter === 'completed') {
        return match?.matchlive[0]?.result?.toLowerCase() === 'complete';
        //return matchEndDate < currentDate;
      } else if (selectedFilter === 'delayedOrAbandoned') {
        // Matches that are genuinely delayed or abandoned
        const isDelayedOrAbandoned = match.matchlive?.[0]?.result === 'delayed' || match.matchlive?.[0]?.result?.toLowerCase() === 'abandon';
        return isDelayedOrAbandoned;
      } else if (selectedFilter === 'notUpdated') {
        // Matches that are not updated due to Cricbuzz API key not working
        if (currentDate > matchDate) {
          const isNotUpdated = (!match.matchlive || !match.matchlive[0]?.result) || (currentDate > matchEndDate && !(match.matchlive?.[0]?.result?.toLowerCase() == 'complete' || match.matchlive?.[0]?.result?.toLowerCase() == 'abandon'));
          return isNotUpdated;
        }
        else {
          return false
        }
      }
      return false;
    });

  const filteredMatchres = selectedFilter === 'all'
    ? allMatches
    : allMatches.filter(match => {
      const matchDate = new Date(match.date);
      const matchEndDate = new Date(match.enddate);
      if (selectedFilter === 'ongoing') {
        return matchDate <= currentDate && matchEndDate >= currentDate;
      } else if (selectedFilter === 'upcoming') {
        return matchDate > currentDate;
      } else if (selectedFilter === 'completed') {
        return match?.matchlive[0]?.result?.toLowerCase() === 'complete';
        //return matchEndDate < currentDate;
      } else if (selectedFilter === 'delayedOrAbandoned') {
        // Matches that are genuinely delayed or abandoned
        const isDelayedOrAbandoned = match.matchlive?.[0]?.result === 'delayed' || match.matchlive?.[0]?.result?.toLowerCase() === 'abandon';
        return isDelayedOrAbandoned;
      } else if (selectedFilter === 'notUpdated') {
        // Matches that are not updated due to Cricbuzz API key not working
        if (currentDate > matchDate) {
          const isNotUpdated = (!match.matchlive || !match.matchlive[0]?.result) || (currentDate > matchEndDate && !(match.matchlive?.[0]?.result?.toLowerCase() == 'complete' || match.matchlive?.[0]?.result?.toLowerCase() == 'abandon'));
          return isNotUpdated;
        }
        else {
          return false
        }
      }
      else if (selectedFilter === 'important') {
        // Matches that are genuinely delayed or abandoned
        console.log('important')
        return match?.important;
      }
      else if (selectedFilter === 'notImportant') {
        return match?.notImportant;
      }
      return false;
    });

  const filteredMatches = allMatches.filter(match => {
    const matchDate = new Date(match.date);
    const matchEndDate = new Date(match.enddate);

    // 1️⃣ Status filter
    let statusPass = false;
    if (selectedFilter === 'all') {
      statusPass = true;
    } else if (selectedFilter === 'ongoing') {
      statusPass = matchDate <= currentDate && matchEndDate >= currentDate;
    } else if (selectedFilter === 'upcoming') {
      statusPass = matchDate > currentDate;
    } else if (selectedFilter === 'completed') {
      statusPass = match?.matchlive?.[0]?.result?.toLowerCase() === 'complete';
    } else if (selectedFilter === 'delayedOrAbandoned') {
      const result = match.matchlive?.[0]?.result?.toLowerCase();
      statusPass = result === 'delayed' || result === 'abandon';
    } else if (selectedFilter === 'notUpdated') {
      if (currentDate > matchDate) {
        const result = match.matchlive?.[0]?.result?.toLowerCase();
        statusPass = (
          !match.matchlive ||
          !result ||
          (currentDate > matchEndDate && !(result === 'complete' || result === 'abandon'))
        );
      }
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

  const handleEdit = (match) => {
    setSelectedMatch(match);
    setEditModalOpen(true);
  };

  const handleUpdate = async (data) => {
    try {
      const response = await API.put(`${URL}/api/match/update_match/${selectedMatch.matchId}`, data);
      // console.log("Update successful:", response.data);
      // Optionally, you can refresh the match details after the update
      const matchData = await API.get(`${URL}/getmatch/${selectedMatch.matchId}`);
      setSelectedMatch(matchData?.data?.match);
      showNotification({
        color: "success",
        icon: "check",
        title: "Match Updated"
      });
    } catch (error) {
      console.error("Update failed:", error);

    }
  };

  const handleDelete = async (match) => {
    setSelectedMatch(match);
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async (match) => {
    try {
      await API.delete(`${URL}/api/match/deletematch/${selectedMatch?.matchId}`);
      fetchMatches();
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error("Delete failed:", error);
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

  const areAllSelected = filteredMatches.length > 0 && filteredMatches.every(m => selectedIds.includes(m.matchId));

  const toggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedIds([]);
    } else {
      const allIds = filteredMatches.map(m => m.matchId);
      setSelectedIds(allIds);
    }
  };

  console.log(allMatches, 'allmatches')

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
      fetchMatches(); // Refresh data
      setLoading(false)
    } catch (err) {
      console.error("Batch update failed", err);
    }
  };

  console.log(allMatches, 'allmatches')

  const tableData = useMemo(() => {
    return matchesTableData({ columnData: filteredMatches, navigate, onEdit: handleEdit, onDelete: handleDelete, selectedIds: selectedIds, handleSelect: handleSelect });
  }, [filteredMatches, navigate, handleEdit]);

  return (
    <DashboardLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                mb={4}
                py={1}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  Matches Table
                </MDTypography>
                <Button variant="contained" color="secondary" onClick={() => setCreateOpen(true)}>
                  Create Match
                </Button>
              </MDBox>
              <MDBox display="flex" justifyContent="space-between" alignItems="center" gap="2" p={2} flexWrap="wrap">
                <MDBox display="flex" justifyContent="start" alignItems="center" py={1}>
                  <MDTypography variant="button" color="text" fontWeight="medium">
                    Matches found:{" "}
                    <MDTypography component="span" variant="button" color="info" fontWeight="bold">
                      ({filteredMatches?.length})
                    </MDTypography>
                  </MDTypography>
                </MDBox>
                <MDBox display="flex" gap={2}>
                  <MDBox>
                    <Tooltip title="Filter matches by status">
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={handleStatusClick}
                        endIcon={<ArrowDropDown />}
                        sx={{ textTransform: "none", minWidth: 180, fontWeight: "medium",color: "#FFF !important" }}
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
                  {selectedIds?.length > 0 && selectedFilter == "notUpdated" &&
                    <StatusButton sx={{ m: "0 !important" }} variant="contained" color="primary" fontWeight="medium" onClick={(e) => handleSelectedUpdate(e)}>
                      Update All
                    </StatusButton>}
                </MDBox>
              </MDBox>
              <MDBox>
                {loading && (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>)}

                {tableData?.rows.length > 0 ? (
                  <DataTable
                    table={tableData}
                    isSorted={true}
                    canSearch={true}
                    entriesPerPage="40"
                    showTotalEntries={true}
                    noEndBorder
                    sx={{
                      '& .MuiTableCell-root': {
                        borderBottom: 'none',
                      },
                      '& .MuiDataGrid-root': {
                        border: 'none',
                      },
                    }}
                  />
                ) : (
                  <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <MDTypography variant="h6" color="textSecondary">
                      No matches available
                    </MDTypography>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <EditMatchModal
        matchId={selectedMatch?.matchId}
        matchdata={selectedMatch}
        teamsList={teamsList}
        seriesList={seriesList}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdate}
      />
      <AddMatch
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        getMatches={fetchMatches}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Match"
        content={`Are you sure you want to delete match ${selectedMatch?.matchId}?`}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
      />
      <NotificationComponent />
    </DashboardLayout>
  );
}

export default Matches;
