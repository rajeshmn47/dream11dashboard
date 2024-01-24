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
import { Drawer } from "@mui/material";
import DataTable from "examples/Tables/DataTable";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDTypography from "components/MDTypography";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import depositsTableData from "layouts/tables/data/depositsTableData";
import withdrawalsTableData from "layouts/tables/data/withdrawalsTableData";
// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Users from "components/Tables/userstable";
import Team from "components/Tables/teamstable";
import styled from "@emotion/styled";
import Contests from "components/Tables/conteststable";
import { URL } from "constants/userconstants";
import { setchartdata } from "utils/chartdata";
import { useEffect, useState } from "react";
import axios from "axios";
import { setlinechartdata } from "utils/chartdata";
import { setmatcheschartdata } from "utils/chartdata";
import "./../dashboard.css";
import { Button, ButtonGroup } from "@mui/material";
import { todaysdata } from "utils/chartdata";
import { getpercentage } from "utils/chartdata";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import { setdoughchartdata } from "utils/chartdata";


const ApproveButton = styled(Button)`
  background: linear-gradient(195deg, #66BB6A, #43A047) !important;
  color: #ffffff !important;
  width: 160px;
  margin: 0 auto;
  &:hover {
    background-color: var(--green);
    color: #ffffff;
  }
`;

const Deatil = styled.div`
  border-top: 1px solid #dddddd;
  margin-top: 10px;
  text-align: left;
  padding: 10px 5px;
  p {
    color: rgba(0, 0, 0, 0.6);
    text-transform: uppercase;
  }
`;

const DeatilTop = styled.div`
  margin-top: 10px;
  text-align: center;
  padding: 10px 0;
  p {
    color: rgba(0, 0, 0, 0.6);
    text-transform: uppercase;
  }
`;

function Dashboard() {
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const { sales, tasks } = reportsLineChartData;
  const [columnData, setColumnData] = useState([]);
  const [wcolumnData, setWColumnData] = useState([]);
  const [selected, setSelected] = useState({ open: false, selected: null, type: 'd' });
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [allusers, setAllUsers] = useState([]);
  const [allteams, setAllTeams] = useState([]);
  const [chartData, setChartData] = useState();
  const [salesData, setSalesData] = useState([]);
  const [matchesChart, setMatchesChart] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsChart, setTransactionsChart] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [doughnutData, setDoughnutData] = useState([])
  const [type, setType] = useState("week");
  useEffect(() => {
    async function getDeposits() {
      setLoading(true);
      let a = await axios.get(`${URL}/payment/depositData`);
      setColumnData(a.data.deposits);
      let w = await axios.get(`${URL}/payment/withdrawData`);
      setWColumnData(w.data.withdrawals);
    }
    getDeposits();
  }, []);
  useEffect(() => {
    async function getteams() {
      setLoading(true);
      let allteamsdata = await axios.get(`${URL}/getallteams`);
      setAllTeams(allteamsdata.data.teams);
      let alluserdata = await axios.get(`${URL}/auth/getallusers`);
      setAllUsers(alluserdata.data.users);
      let allmatchesdata = await axios.get(`${URL}/allmatches`);
      let alltransactionsdata = await axios.get(`${URL}/payment/alltransactions`);
      console.log(alltransactionsdata.data, "mat");
      setTransactions(alltransactionsdata.data)
      setAllMatches(allmatchesdata.data.matches);
      setLoading(false);
    }
    getteams();
  }, []);
  useEffect(() => {
    setChartData(setchartdata(allteams, type, 'teams'));
    setSalesData(setchartdata(allusers, type, 'users'));
    setTransactionsChart(setchartdata(transactions, type, 'transactions'))
    setMatchesChart(setmatcheschartdata(allMatches, type, 'matches'));
    setDoughnutData(setdoughchartdata(allusers, 'users'))
  }, [type, allteams, allusers, allMatches, transactions]);

  useEffect(() => {
    console.log(doughnutData, 'dough')
  }, [type]);
  const handleView = (s) => {
    setSelected({ open: true, data: s })
  }
  const handleWView = (s) => {
    setSelected({ open: true, data: s, type: 'w' })
  }
  const handleApprove = async () => {
    await axios.get(`${URL}/payment/approveWithdraw?withdrawId=${selected.data._id}`);
    setSelected({...selected,open:false});
    let w = await axios.get(`${URL}/payment/withdrawData`);
    setWColumnData(w.data.withdrawals);
  }
  const { columns, rows } = depositsTableData({ columnData, handleView });
  const { wcolumns, wrows } = withdrawalsTableData({ wcolumnData, handleWView });
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Today's Teams"
                count={todaysdata(allteams).length}
                percentage={{
                  color: getpercentage(allteams) > 0 ? "success" : "error",
                  amount: getpercentage(allteams) > 0 ? "+" + getpercentage(allteams) + "%" : getpercentage(allteams) + "%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count={todaysdata(allusers).length}
                percentage={{
                  color: getpercentage(allusers) > 0 ? "success" : "error",
                  amount: getpercentage(allusers) > 0 ? "+" + getpercentage(allusers) + "%" : getpercentage(allusers) + "%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count={allusers.reduce((a, b) => b.wallet + a, 0)}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Users"
                count={allusers.length}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          style={{ color: "#FFFFFF !important" }}
        >
          <Button
            onClick={() => setType("day")}
            className={type == "day" ? "selected" : "notselected"}
          >
            day
          </Button>
          <Button
            onClick={() => setType("week")}
            className={type == "week" ? "selected" : "notselected"}
          >
            week
          </Button>
          <Button
            onClick={() => alert('its not working')}
            className={type == "month" ? "selected" : "notselected"}
          >
            month
          </Button>
        </ButtonGroup>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                {chartData && (
                  <ReportsBarChart
                    color="info"
                    title="today's teams"
                    description="Last Campaign Performance"
                    date="campaign sent 2 days ago"
                    chart={chartData}
                  />
                )}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="Todays's users"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={salesData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Today's matches"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={matchesChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="primary"
                  title="Today's transactions"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={transactionsChart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={12}>
              <MDBox mb={3}>
                <DefaultDoughnutChart
                  color="primary"
                  title="Users"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={doughnutData}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Card>
                <MDBox
                  mx={2}
                  mt={3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Deposit Requests
                  </MDTypography>
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
              </Card>
              <Card className="withdrawals">
                <MDBox
                  mx={2}
                  mt={3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Withdrawal Requests
                  </MDTypography>
                </MDBox>
                <MDBox pt={3}>
                  <DataTable
                    table={{ columns: wcolumns, rows: wrows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                </MDBox>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Users users={allusers} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Team teams={allteams} />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Contests />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Drawer anchor="top" open={selected.open} onClose={() => setSelected({ ...selected, open: false })}>
        <DeatilTop>
          <p>amount</p>
          <h5>₹{selected?.data && selected?.data.amount}</h5>
        </DeatilTop>
        <DeatilTop>
          <p>user</p>
          <h5>{selected?.data?.user[0]?.username}</h5>
        </DeatilTop>
        <DeatilTop>
          <p>upi ID</p>
          <h5>{selected?.data?.user[0]?.upiId}</h5>
        </DeatilTop>
        <DeatilTop>
          <p>account details</p>
          <h5>{selected?.data?.user[0]?.accountNumber}</h5>
          <h5>{selected?.data?.user[0]?.ifsc}</h5>
        </DeatilTop>
        <ApproveButton color="success" onClick={() =>
          handleApprove()}>approve</ApproveButton>
      </Drawer>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
