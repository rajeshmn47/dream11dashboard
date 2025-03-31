import React, { useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function SuspiciousActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for suspicious activities
  const mockActivities = [
    {
      _id: "1",
      user: "JohnDoe",
      activity: "Multiple failed login attempts",
      timestamp: "2025-03-30 14:23:45",
    },
    {
      _id: "2",
      user: "JaneSmith",
      activity: "Unusual withdrawal request",
      timestamp: "2025-03-29 10:15:30",
    },
    {
      _id: "3",
      user: "AliceBrown",
      activity: "Access from multiple IPs",
      timestamp: "2025-03-28 18:45:12",
    },
  ];

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 1000);
  }, []);

  const columns = [
    { Header: "User", accessor: "user", align: "left" },
    { Header: "Activity", accessor: "activity", align: "center" },
    { Header: "Timestamp", accessor: "timestamp", align: "center" },
  ];

  const rows = activities.map((activity) => ({
    user: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {activity.user}
      </MDTypography>
    ),
    activity: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {activity.activity}
      </MDTypography>
    ),
    timestamp: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {activity.timestamp}
      </MDTypography>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="error"
                borderRadius="lg"
                coloredShadow="error"
              >
                <MDTypography variant="h6" color="white">
                  Suspicious Activities
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  loading={loading}
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

export default SuspiciousActivities;