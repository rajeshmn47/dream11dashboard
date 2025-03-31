/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from "react";
import { Box, CircularProgress, Button, Card, Grid, Typography } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { API } from "api";
import { URL } from "constants/userconstants";
import styled from "@emotion/styled";
import { useNavigate, useParams } from "react-router-dom";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import contestsTableData from "./data/contestTableData";
import contestUsersTableData from "./data/contestUsersTable";
import { getDisplayDate } from "utils/dateformat";

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

const StatusContainer = styled.div`
display:flex;
flex-direction:column;
align-items:center;
  @media (max-width: 600px) {
    font-size: 12px;
  }
`;

function MatchDetails() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = useState(false);
  const [contests, setContests] = useState([]);
  const [teams, setTeams] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [contestUsers, setContestUsers] = useState([]);
  const [match, setMatch] = useState([]);
  const [liveMatch, setLiveMatch] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getContests();
    }
  }, [id]);

  useEffect(() => {
    async function fetchUsers() {
      let a = allUsers.filter((user) => !!(contests?.find((contest) => contest.userIds.includes(user?._id))));
      setContestUsers(a?.length > 0 ? [...a] : []);
    }
    if (allUsers?.length > 0 && contests?.length > 0) {
      fetchUsers();
    }
  }, [allUsers, contests]);

  const { wcolumns, wrows } = contestsTableData({ wcolumnData: contests });
  const { ucolumns, urows } = contestUsersTableData({ ucolumnData: contestUsers, contests: contests, teams: teams });

  async function getContests() {
    const { data } = await API.get(`${URL}/getcontests/${id}`);
    setContests([...data?.contests]);
    let alluserdata = await API.get(`${URL}/auth/getallusers`);
    setAllUsers(alluserdata.data.users);
    let matchData = await API.get(`${URL}/getmatch/${id}`);
    setMatch(matchData?.data?.match);
    setLiveMatch(matchData?.data?.livematch);
    const teamsData = await API.get(`${URL}/getTeamsofMatch/${id}`);
    setTeams([...teamsData?.data?.teams]);
  }

  const handleUpdate = async () => {
    // Implement the update logic here
    console.log("Update button clicked");
    async function fetchMatches() {
      setLoading(true);
      try {
        const response = await API.get(`${URL}/api/match/update_to_live/${id}`);
        const response_data = await API.get(`${URL}/api/match/update_live_scores/${id}`);
        //setAllMatches(response.data.matches || []);
        getContests()
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await API.delete(`${URL}/api/match/deletematch/${id}`);
      console.log("Delete successful");
      navigate("/matches"); // Redirect to matches list after deletion
    } catch (error) {
      console.error("Delete failed:", error);
      setLoading(false);
    }
  };

  const isDelayedOrNotUpdated = !liveMatch?.result || !(liveMatch?.result.toLowerCase() == 'complete' || liveMatch?.result.toLowerCase() == 'abandon');

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                  <MDBox
                    mx={2}
                    my={1}
                    py={3}
                    px={2}
                    variant="gradient"
                    borderRadius="lg"
                  >
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item sm={5} xs={5} style={{ textAlign: 'left' }}>
                        <TeamName>
                          {match?.teamHomeName}
                        </TeamName>
                        <TeamCode
                          style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                          }}
                        >
                          {match?.teamHomeCode}
                        </TeamCode>
                        <Grid container>
                          <Grid item sm={3} xs={3} md={2} style={{ textAlign: 'left' }}>
                            <FlagImg src={match?.teamHomeFlagUrl} alt="flag" />
                          </Grid>
                          <Grid item sm={6} xs={6} md={3} style={{ textAlign: 'left' }}>
                            {liveMatch?.runFI || "-"}/{liveMatch?.wicketsFI || "-"}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        sm={2}
                        xs={2}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <GreenMark />
                        <StatusContainer>
                          <Status>
                            {liveMatch?.result === 'Complete' ? 'Completed' : liveMatch?.result === 'In Progress' ?
                              'In Play' : liveMatch?.result === 'Abandon' ? 'Abandoned' : null}
                          </Status>
                          <Status>
                            {getDisplayDate(match?.date, new Date())}
                          </Status>
                        </StatusContainer>
                      </Grid>
                      <Grid item sm={5} xs={5} style={{ textAlign: 'right' }}>
                        <>
                          <TeamName>
                            {' '}
                            {match?.teamAwayName}
                          </TeamName>
                          <TeamCode>
                            {' '}
                            {match?.teamAwayCode}
                          </TeamCode>
                          <Grid container justifyContent="flex-end">
                            <Grid item sm={6} xs={6} md={3} lg={3} style={{ textAlign: 'right' }}>
                              {liveMatch?.runSI || "-"}/{liveMatch?.wicketsSI || "-"}
                            </Grid>
                            <Grid item sm={3} xs={3} md={2} lg={2} style={{ textAlign: 'right' }}>
                              <FlagImg src={match?.teamAwayFlagUrl} alt="flag" />
                            </Grid>
                          </Grid>
                        </>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Grid>
              </Grid>
              <Typography variant="h6" textAlign="center">
                {liveMatch?.status}
              </Typography>
              {isDelayedOrNotUpdated && (
                <MDBox display="flex" justifyContent="center" alignItems="center" mt={2} p={2}>
                  <Typography variant="h6" color="error">
                    Match Delayed or Not Updated
                  </Typography>
                  <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ ml: 2 }}>
                    Update
                  </Button>
                  <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
                    Delete Match
                  </Button>
                </MDBox>
              )}
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Users Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: ucolumns?.length > 0 ? [...ucolumns] : [], rows: urows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Contests Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: [...wcolumns], rows: wrows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default MatchDetails;
