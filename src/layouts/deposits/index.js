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
import useNotification from "hooks/useComponent";
import MDBadge from "components/MDBadge";
import { ArrowOutward } from "@mui/icons-material";

function Deposits() {
  const [depositsData, setDepositsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification, NotificationComponent } = useNotification();

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

  const handleApprove = async (deposit) => {
    try {
      await API.get(`${URL}/payment/approve?depositId=${deposit._id}&userId=${deposit?.user?._id}`, { verified: true }); // Update to your actual endpoint   
      showNotification({
        color: "success",
        icon: "check",
        title: "Deposit approved successfully!"
      });
      // Refresh deposits data
      setDepositsData((prevData) =>
        prevData.map((d) =>
          d._id === deposit._id ? { ...d, verified: true } : d
        )
      );
    } catch (error) {
      console.error("Error approving deposit:", error);
    }
  };

  const handleDecline = async (deposit) => {
    try {
      await API.put(`${URL}/payment/decline/${deposit._id}`, { verified: false }); // Update to your actual endpoint   
      showNotification({
        color: "error",
        icon: "check",
        title: "Deposit declined!"
      });
      // Refresh deposits data
      setDepositsData((prevData) =>
        prevData.map((d) =>
          d._id === deposit._id ? { ...d, verified: false } : d
        )
      );
    }
    catch (error) {
      console.error("Error declining deposit:", error);
    }
  };

  const columns = [
    { Header: "User", accessor: "user", align: "left" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Timestamp", accessor: "timestamp", align: "center" },
    { Header: "Actions", accessor: "actions", align: "center" }
  ];

  const rows = depositsData.map((deposit) => ({
    user: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit?.user?.username}
      </MDTypography>
    ),
    amount: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        ₹{deposit.amount}
      </MDTypography>
    ),
    status: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit.verified ? 'verified' : 'pending'}
      </MDTypography>
    ),
    timestamp: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit.createdAt}
      </MDTypography>
    ),
    actions: (
      <MDBox display="flex" justifyContent="center">
        <MDBox ml={-1} sx={{ cursor: 'pointer' }} onClick={() => handleApprove(deposit)}>
          <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            approve <ArrowOutward style={{ fontSize: 18 }} />
          </span>} color="success" variant="gradient" size="sm" />
        </MDBox>
        <MDBox ml={1} sx={{ cursor: 'pointer' }} onClick={() => handleDecline(deposit)}>
          <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            decline <ArrowOutward style={{ fontSize: 18 }} />
          </span>} color="error" variant="gradient" size="sm" />
        </MDBox>
      </MDBox>
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