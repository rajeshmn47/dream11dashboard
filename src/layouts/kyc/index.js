import React, { useEffect, useState } from "react";
import { Grid, Card, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function KYC() {
  const [kycData, setKycData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data for KYC requests
  const mockKYCData = [
    {
      _id: "1",
      user: { username: "JohnDoe" },
      documentType: "Passport",
      documentUrl: "https://example.com/document1.pdf",
      status: "Pending",
    },
    {
      _id: "2",
      user: { username: "JaneSmith" },
      documentType: "Driver's License",
      documentUrl: "https://example.com/document2.pdf",
      status: "Pending",
    },
    {
      _id: "3",
      user: { username: "AliceBrown" },
      documentType: "Aadhar Card",
      documentUrl: "https://example.com/document3.pdf",
      status: "Approved",
    },
  ];

  useEffect(() => {
    // Simulate fetching data
    setLoading(true);
    setTimeout(() => {
      setKycData(mockKYCData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleApprove = (id) => {
    setKycData((prevData) =>
      prevData.map((data) =>
        data._id === id ? { ...data, status: "Approved" } : data
      )
    );
  };

  const handleReject = (id) => {
    setKycData((prevData) =>
      prevData.map((data) =>
        data._id === id ? { ...data, status: "Rejected" } : data
      )
    );
  };

  const columns = [
    { Header: "User", accessor: "user", align: "left" },
    { Header: "Document Type", accessor: "documentType", align: "center" },
    { Header: "Document", accessor: "document", align: "center" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = kycData.map((data) => ({
    user: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.user.username}
      </MDTypography>
    ),
    documentType: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.documentType}
      </MDTypography>
    ),
    document: (
      <a href={data.documentUrl} target="_blank" rel="noopener noreferrer">
        View Document
      </a>
    ),
    status: (
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {data.status}
      </MDTypography>
    ),
    action: (
      <MDBox display="flex" justifyContent="center" gap={1}>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={() => handleApprove(data._id)}
          disabled={data.status === "Approved"}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleReject(data._id)}
          disabled={data.status === "Rejected"}
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
      <Footer />
    </DashboardLayout>
  );
}

export default KYC;