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
import { Box, CircularProgress, Button, Card, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Delete } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { API } from "api";
import { URL } from "constants/userconstants";
import CreateContestTypeForm from "./CreateContestTypeForm";

function ContestTypes() {
  const [contestTypes, setContestTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedContestType, setSelectedContestType] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteContestTypeId, setDeleteContestTypeId] = useState(null);

  useEffect(() => {
    fetchContestTypes();
  }, []);

  const fetchContestTypes = async () => {
    try {
      const response = await API.get(`${URL}/contestTypes`);
      setContestTypes(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contest types:", error);
      setLoading(false);
    }
  };

  const handleOpen = (contestType = {
    name: '',
    description: '',
    prizes: [],
    totalSpots: '',
    numWinners: '',
    entryFee: '',
  }) => {
    console.log(contestType, 'contesttype');
    setSelectedContestType(contestType);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedContestType(null);
  };

  const handleDeleteDialogOpen = (id) => {
    setDeleteContestTypeId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setDeleteContestTypeId(null);
  };

  const handleDelete = async () => {
    try {
      await API.delete(`${URL}/contestTypes/${deleteContestTypeId}`);
      fetchContestTypes();
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting contest type:", error);
    }
  };

  const columns = [
    { Header: 'Name', accessor: 'name', width: '20%' },
    { Header: 'Description', accessor: 'description', width: '20%' },
    { Header: 'Prize', accessor: 'prize', width: '10%' },
    { Header: 'Total Spots', accessor: 'totalSpots', width: '10%' },
    { Header: 'Number of Winners', accessor: 'numWinners', width: '10%' },
    { Header: 'Entry Fee', accessor: 'entryFee', width: '10%' },
    {
      Header: 'Actions',
      accessor: 'actions',
      width: '20%',
      Cell: ({ row }) => (
        <div>
          <Button variant="contained" color="primary" onClick={() => handleOpen(row.original)}>
            Edit
          </Button>
          <IconButton onClick={() => handleDeleteDialogOpen(row.original._id)} color="secondary">
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = contestTypes.length > 0 ? contestTypes.map((contestType) => ({
    ...contestType,
    actions: (
      <div>
        <Button variant="contained" color="primary" onClick={() => handleOpen(contestType)}>
          Edit
        </Button>
        <IconButton onClick={() => handleDeleteDialogOpen(contestType._id)} color="secondary">
          <Delete />
        </IconButton>
      </div>
    ),
  })) : [];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox mb={3}>
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
                Contest Types
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                contestTypes.length > 0 ? (
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                ) : (
                  <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                    <MDTypography variant="h6" color="textSecondary">
                      No contest types available
                    </MDTypography>
                  </MDBox>
                )
              )}
            </MDBox>
          </Card>
        </MDBox>
        <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ mt: 2 }}>
          Add Contest Type
        </Button>
        <CreateContestTypeForm
          open={open}
          handleClose={handleClose}
          selectedContestType={selectedContestType}
          fetchContestTypes={fetchContestTypes}
        />
        <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} >
          <DialogTitle style={{backgroundColor:"#202940"}}>Confirm Delete</DialogTitle>
          <DialogContent style={{backgroundColor:"#202940"}}>
            <MDTypography>Are you sure you want to delete this contest type?</MDTypography>
          </DialogContent>
          <DialogActions style={{backgroundColor:"#202940"}}>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ContestTypes;
