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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

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

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import Users from "components/Tables/userstable";
import Team from "components/Tables/teamstable";
import Contests from "components/Tables/conteststable";
import { URL } from "constants/userconstants";
import { setchartdata } from "utils/chartdata";
import { useEffect,useState } from "react";
import axios from "axios";
import { setlinechartdata } from "utils/chartdata";
import { setmatcheschartdata } from "utils/chartdata";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const [loading,setLoading]=useState(false)
  const [teams,setTeams]=useState([]);
  const [users,setUsers]=useState([]);
  const [allusers,setAllUsers]=useState([])
  const [chartData,setChartData]=useState();
  const [salesData,setSalesData]=useState([]);
  const [matchesChart,setMatchesChart]=useState([]);
  useEffect(() => {
    async function getteams() {
      setLoading(true);
      let data = await axios.get(`${URL}/gettodayteams`);
      let alluserdata = await axios.get(`${URL}/auth/getallusers`);
      setAllUsers(alluserdata.data.users);
      setChartData(setchartdata(data.data.teams));
      setTeams(data.data.teams)
      let userdata = await axios.get(`${URL}/auth/gettodayusers`);
      let ab=setlinechartdata(userdata.data.users)
      console.log(ab,'ab')
      setSalesData(ab)
      setUsers(userdata.data.users);
      let z = await axios.get(`${URL}/todaymatches`);
      let matchesdata=setmatcheschartdata(z);
      setMatchesChart(matchesdata);
      setLoading(false);
    }
    getteams();
  }, []);
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
                count={teams.length}
                percentage={{
                  color: "success",
                  amount: "+55%",
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
                count={users.length}
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
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
                count={allusers.reduce((a,b)=>b.wallet+a,0)}
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
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                {chartData&&<ReportsBarChart
                  color="info"
                  title="teams created"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={chartData}
                />}
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
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
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="live matches"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={matchesChart}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
           <Users/>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
           <Team/>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
           <Contests/>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
