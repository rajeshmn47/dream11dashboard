import React, { useEffect, useState } from "react";
import { Grid, Card, Button, Modal, Box } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import useNotification from "hooks/useComponent";
import { URL } from "constants/userconstants";
import { API } from "api";

function KYC() {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalDocs, setModalDocs] = useState([]);
  const { showNotification, NotificationComponent } = useNotification();

  const fetchKycData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`${URL}/kyc/all`);
      setKycData([...res.data]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch KYC data", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`${URL}/kyc/verify/${id}`, { status: status });
      setKycData((prevData) =>
        prevData.map((item) =>
          item._id == id ? { ...item, status: res.data.kyc.status } : item
        )
      );
      showNotification({
        color: "success",
        icon: "check",
        title: `KYC ${status} successfully!`
      });
    } catch (err) {
      console.error(err);
      showNotification({
        color: "error",
        icon: "check",
        title: "Failed to update"
      });
    }
  };

  const handleApprove = (id) => updateStatus(id, "approved");
  const handleReject = (id) => updateStatus(id, "rejected");

  const handleOpenModal = (docs) => {
    setModalDocs(docs);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  // Table columns
  const columns = [
    { Header: "User", accessor: "user", align: "left" },
    { Header: "Documents", accessor: "docs", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = kycData.map((item) => ({
    user: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {item.userId?.email || "Unknown"}
      </MDTypography>
    ),
    docs: (
      <MDBox display="flex" flexDirection="column" gap={0.5}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenModal(item.docs)}
        >
          View Documents ({item.docs.length})
        </Button>
      </MDBox>
    ),
    status: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" gap={1}>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleApprove(item._id, "approved")}
          disabled={item.status === "approved"}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleReject(item._id, "rejected")}
          disabled={item.status === "rejected"}
        >
          Reject
        </Button>
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
                  KYC Requests
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

      {/* Modal for viewing documents */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <MDTypography variant="h6" mb={2}>
            Documents
          </MDTypography>
          {modalDocs.map((url, idx) => (
            <a
              key={idx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", marginBottom: "10px", wordBreak: "break-all" }}
            >
              Document {idx + 1}
            </a>
          ))}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleCloseModal}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>

      <Footer />
      <NotificationComponent />
    </DashboardLayout>
  );
}

export default KYC;
