import { useEffect, useState } from "react";
import { Box, CircularProgress, Button, Card, Grid } from "@mui/material";
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

  const filteredMatches = selectedFilter === 'all'
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
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const { columns, rows } = matchesTableData({ columnData: filteredMatches, navigate, onEdit: handleEdit });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                mb={4}
                py={3}
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

              <MDBox display="flex" justifyContent="center" style={{color:"#FFF !important"}} mb={2}>
                <StatusButton variant={selectedFilter === 'notUpdated' ? 'contained' : 'outlined'} onClick={() => filterMatches('notUpdated')} sx={{ mx: 1 }}>
                  Not Updated
                </StatusButton>
                <StatusButton variant={selectedFilter === 'all' ? 'contained' : 'outlined'} onClick={() => filterMatches('all')} sx={{ mx: 1 }}>
                  All Matches
                </StatusButton>
                <StatusButton variant={selectedFilter === 'ongoing' ? 'contained' : 'outlined'} onClick={() => filterMatches('ongoing')} sx={{ mx: 1 }}>
                  Ongoing
                </StatusButton>
                <StatusButton variant={selectedFilter === 'upcoming' ? 'contained' : 'outlined'} onClick={() => filterMatches('upcoming')} sx={{ mx: 1 }}>
                  Upcoming
                </StatusButton>
                <StatusButton variant={selectedFilter === 'completed' ? 'contained' : 'outlined'} onClick={() => filterMatches('completed')} sx={{ mx: 1 }}>
                  Completed
                </StatusButton>
                <StatusButton variant={selectedFilter === 'delayedOrAbandoned' ? 'contained' : 'outlined'} onClick={() => filterMatches('delayedOrAbandoned')} sx={{ mx: 1 }}>
                  Delayed or Abandoned
                </StatusButton>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  rows.length > 0 ? (
                    <DataTable
                      table={{ columns, rows }}
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
                  )
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
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdate}
      />
      <AddMatch
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        getMatches={fetchMatches}
      />

    </DashboardLayout>
  );
}

export default Matches;
