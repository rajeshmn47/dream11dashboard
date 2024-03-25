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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import contestsTableData from "./data/contestTableData";
import contestUsersTableData from "./data/contestUsersTable";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "api";
import { URL } from "constants/userconstants";
import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import { getDisplayDate } from "utils/dateformat";

const FlagImg = styled.img`
width:25px;
margin: 0 5px
`;
const Teams = styled.div`
display:flex;
justify-content:flex-start;
align-items:center;
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
display:block;
@media (max-width: 600px) {
    display:none;
  }
`;
const TeamCode = styled.p`
text-overflow: ellipsis;
overflow: hidden;
display:none;
@media (max-width: 600px) {
    display:block;
  }
`;
const Status = styled.p`

@media (max-width: 600px) {
    font-size:12px;
  }
`;

function MatchDetails() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [contests, setContests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [contestUsers, setContestUsers] = useState([]);
  const [match, setMatch] = useState([]);
  const [liveMatch, setLiveMatch] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    async function getContests() {
      const { data } = await API.get(`${URL}/getcontests/${id}`);
      setContests([...data?.contests]);
      let alluserdata = await API.get(`${URL}/auth/getallusers`);
      setAllUsers(alluserdata.data.users);
      let matchData = await API.get(`${URL}/getmatch/${id}`);
      setMatch(matchData?.data?.match);
      setLiveMatch(matchData?.data?.livematch)
    }
    if (id) {
      getContests()
    }
  }, [id])
  useEffect(() => {
    async function fetchUsers() {
      let a = allUsers.filter((user) => !!(contests?.find((contest) => contest.userIds.includes(user?._id))))
      setContestUsers(a?.length > 0 ? [...a] : [])
    }
    if (allUsers?.length > 0 && contests?.length > 0) {
      fetchUsers()
    }
  }, [allUsers, contests]);
  const { wcolumns, wrows } = contestsTableData({ wcolumnData: contests });
  const { ucolumns, urows } = contestUsersTableData({ ucolumnData: contestUsers });
  console.log(liveMatch, 'match');
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
                       <Status>
                        {liveMatch?.result == 'Complete' ? 'Completed' : liveMatch?.result == 'In Progress' ?
                          'In Play' : getDisplayDate(match?.date, new Date())}
                          </Status>
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
