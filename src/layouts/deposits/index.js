import React, { useEffect, useState } from "react";
import { Grid, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { API } from "api";
import { URL } from "constants/userconstants";

function Deposits() {
  const [depositsData, setDepositsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDeposits() {
      setLoading(true);
      try {
        const response = await API.get(`${URL}/payment/depositData`);
        setDepositsData(response.data.deposits || []);
      } catch (error) {
        console.error("Error fetching deposits data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDeposits();
  }, []);

  const columns = [
    { Header: "User", accessor: "user", align: "left" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Timestamp", accessor: "timestamp", align: "center" },
  ];

  const rows = depositsData.map((deposit) => ({
    user: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit.user.username}
      </MDTypography>
    ),
    amount: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        ₹{deposit.amount}
      </MDTypography>
    ),
    status: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit.status}
      </MDTypography>
    ),
    timestamp: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit.timestamp}
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

export default Deposits;