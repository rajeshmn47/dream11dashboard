import React, { useEffect, useState } from "react";
import { Grid, Card, Button, Chip } from "@mui/material";
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
import DepositModal from "components/deposits/DepositModal";

function Deposits() {
  const [depositsData, setDepositsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const { showNotification, NotificationComponent } = useNotification();
  const [allUsersList, setAllUsersList] = useState([]);

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    fetchDeposits();
  }, []);

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

  const onUpdate = async (deposit) => {
    try {
      showNotification({
        color: "success",
        icon: "check",
        title: "Deposit approved successfully!"
      });
      // Refresh deposits data
      fetchDeposits()
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

  const fetchUsers = async () => {
    try {
      const res = await API.get(`${URL}/admin/users`); // Update endpoint as needed
      setAllUsersList(res.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleApprove = async (deposit) => {
    await API.get(`${URL}/payment/approve?depositId=${deposit._id}`);
    let w = await API.get(`${URL}/payment/depositData`);
    fetchDeposits()
  }

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
      <MDBox ml={-1} sx={{ cursor: 'pointer' }} onClick={() => handleApprove(deposit)}>
        <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {deposit.status}
        </span>} color={deposit.verified ? "success" : "warning"} variant="gradient" size="sm" />
      </MDBox>
    ),
    timestamp: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {deposit.createdAt}
      </MDTypography>
    ),
    actions: (
      <MDBox display="flex" justifyContent="center">
        {deposit.status == "pending" ?
          <>
            <MDBox ml={-1} sx={{ cursor: 'pointer' }} onClick={() => handleApprove(deposit)}>
              <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                approve
              </span>} color="success" variant="gradient" size="sm" />
            </MDBox>
            <MDBox ml={1} sx={{ cursor: 'pointer' }} onClick={() => handleDecline(deposit)}>
              <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                decline
              </span>} color="error" variant="gradient" size="sm" />
            </MDBox></> : <MDBox ml={1}>—</MDBox>}
      </MDBox>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Button
        variant="contained"
        sx={{ mt: 2, float: "right", mr: 2 }}
        onClick={() => setOpen(true)}
      >
        Add Deposit
      </Button>
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
                  isSorted={true}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  loading={loading}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <DepositModal
          open={open}
          onClose={() => setOpen(false)}
          onDeposit={onUpdate}
          allUsersList={allUsersList}
        />
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Deposits;