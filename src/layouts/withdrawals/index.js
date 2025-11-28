import React, { useEffect, useState } from "react";
import { Drawer, Grid, Card, Tooltip, Menu, MenuItem, Dialog } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import projectsTableData from "layouts/tables/data/projectsTableData";
import depositsTableData from "layouts/tables/data/depositsTableData";
import withdrawalsTableData from "layouts/tables/data/withdrawalsTableData";
import { API } from "api";
import { URL } from "constants/userconstants";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import useNotification from "hooks/useComponent";
import WithdrawalModal from "components/withdrawals/WithdrawalModal";
import { ArrowDropDown } from "@mui/icons-material";
import MDBadge from "components/MDBadge";

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

const RejectButton = styled(Button)`
  background: linear-gradient(195deg, #EF5350, #E53935) !important;
  color: #ffffff !important;
  width: 160px;
  margin: 0 auto;
  &:hover {
    background-color: var(--green);
    color: #ffffff;
  }
`;


const DeatilTop = styled.div`
  margin-top: 10px;
  text-align: center;
  padding: 10px 0;
  color: #fff;
  p {
    color: #fff;
    text-transform: uppercase;
  }
`;

function Withdrawals() {
    const [wcolumnData, setWColumnData] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [selected, setSelected] = useState({ open: false, data: null });
    const [loading, setLoading] = useState(false);
    const { showNotification, NotificationComponent } = useNotification();
    const [open, setOpen] = useState(false);
    const [allUsersList, setAllUsersList] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const statusOpen = Boolean(statusAnchorEl)
    const statusOptions = [
        { value: 'all', label: 'All Withdrawals' },
        { value: 'pending', label: 'Pending' },
        { value: 'completed', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
    ];

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    useEffect(() => {
        fetchUsers()
    }, []);

    useEffect(() => {
        if (statusFilter == "all") {
            console.log(wcolumnData, statusFilter, 'all column data')
            setWColumnData([...withdrawals])
        }
        else {
            let w = withdrawals.filter((w) => w.status == statusFilter)
            setWColumnData([...w])
        }
    }, [statusFilter, withdrawals])

    const fetchUsers = async () => {
        try {
            const res = await API.get(`${URL}/admin/users`); // Update endpoint as needed
            setAllUsersList(res.data.users);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const handleStatusSelect = (value) => {
        setStatusFilter(value)
        handleClose();
    };

    const handleStatusClose = () => {
        setStatusAnchorEl(null);
    }

    const handleStatusClick = (event) => setStatusAnchorEl(event.currentTarget)
    const handleClose = () => setStatusAnchorEl(null);

    const handleWView = (data) => {
        setSelected({ open: true, data });
    };

    async function fetchWithdrawals() {
        setLoading(true);
        const response = await API.get(`${URL}/payment/withdrawData`);
        setWithdrawals([...response.data.withdrawals]);
        setLoading(false);
    }

    const handleApprove = async () => {
        try {
            setLoading(true);

            const res = await API.get(
                `${URL}/payment/approveWithdraw?withdrawId=${selected.data._id}`
            );

            showNotification({
                color: "success",
                icon: "check",
                title: "Success!",
                message: res.data.message || "Withdrawal approved successfully!"
            });

            setSelected({ ...selected, open: false });

            const response = await API.get(`${URL}/payment/withdrawData`);
            setWColumnData(response.data.withdrawals);

        } catch (error) {
            console.error("Approve withdraw error:", error);
            setSelected({ ...selected, open: false });
            showNotification({
                color: "error",
                icon: "x",
                title: "Approval Failed!",
                message:
                    error?.response?.data?.message ||
                    "Something went wrong while approving withdrawal."
            });
        } finally {
            setLoading(false);
        }
    };


    const handleReject = async () => {
        try {
            setLoading(true);

            const res = await API.get(
                `${URL}/payment/rejectWithdraw?withdrawId=${selected.data._id}`
            );

            showNotification({
                color: "success",
                icon: "check",
                title: "Rejected!",
                message: res.data.message || "Withdrawal rejected successfully!"
            });

            setSelected({ ...selected, open: false });

            const response = await API.get(`${URL}/payment/withdrawData`);
            setWColumnData(response.data.withdrawals);

        } catch (error) {
            console.error("Reject withdraw error:", error);
            setSelected({ ...selected, open: false });
            showNotification({
                color: "error",
                icon: "x",
                title: "Rejection Failed!",
                message:
                    error?.response?.data?.message ||
                    "Something went wrong while rejecting withdrawal."
            });
        } finally {
            setLoading(false);
        }
    };

    const onUpdate = async (deposit) => {
        try {
            showNotification({
                color: "success",
                icon: "check",
                title: "Deposit approved successfully!"
            });
            // Refresh deposits data
            fetchWithdrawals()
        } catch (error) {
            console.error("Error approving deposit:", error);
        }
    };

    console.log(wcolumnData, statusFilter, withdrawals, 'column data')

    const { wcolumns, wrows } = withdrawalsTableData({ wcolumnData: wcolumnData, handleWView, handleApprove });

    return (
        <>
            <DashboardLayout>
                <DashboardNavbar />
                <MDBox display="flex" justifyContent="space-between">
                    <MDBox>
                        <Tooltip title="Filter matches by status">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={handleStatusClick}
                                endIcon={<ArrowDropDown />}
                                sx={{ textTransform: "none", minWidth: 180, fontWeight: "medium", color: "#FFF !important" }}
                            >
                                Status: {statusOptions.find(o => o.value === statusFilter)?.label || 'All Matches'}
                            </Button>
                        </Tooltip>

                        <Menu anchorEl={statusAnchorEl} open={statusOpen} onClose={handleStatusClose}>
                            {statusOptions.map(option => (
                                <MenuItem
                                    key={option.value}
                                    selected={statusFilter === option.value}
                                    onClick={() => {
                                        handleStatusSelect(option.value);
                                        handleStatusClose();
                                    }}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Menu>
                    </MDBox>
                    <Button
                        variant="contained"
                        sx={{}}
                        onClick={() => setOpen(true)}
                    >
                        Add Withdraw
                    </Button>
                </MDBox>
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
                                        Withdrawal Requests
                                    </MDTypography>
                                </MDBox>
                                <MDBox pt={3}>
                                    <DataTable
                                        table={{ columns: wcolumns, rows: wrows }}
                                        isSorted={true}
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
            <Dialog
                open={selected.open}
                onClose={() => setSelected({ ...selected, open: false })}
                PaperProps={{
                    sx: {
                        width: "350px",
                        maxWidth: "350px",
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor: "#344767", color: "#fff", p: 3
                    }
                }}
            >
                {/* Close button */}
                < div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="text" onClick={() => setSelected({ ...selected, open: false })}>
                        <p style={{ color: "#fff" }}>Close</p>
                    </Button>
                </div>

                <DeatilTop>
                    <p>Amount</p>
                    <h5>₹{selected?.data?.amount}</h5>
                </DeatilTop>

                <DeatilTop>
                    <p>User</p>
                    <h5>{selected?.data?.user[0]?.username}</h5>
                </DeatilTop>

                <DeatilTop>
                    <p>UPI ID</p>
                    <h5>{selected?.data?.user[0]?.upiId}</h5>
                </DeatilTop>

                <DeatilTop>
                    <p>Account Details</p>
                    <h5>{selected?.data?.user[0]?.accountNumber}</h5>
                    <h5>{selected?.data?.user[0]?.ifsc}</h5>
                </DeatilTop>

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                    <ApproveButton color="success" onClick={handleApprove}>Approve</ApproveButton>
                    <RejectButton color="success" onClick={handleReject}>
                        Reject
                    </RejectButton>
                </div>
            </Dialog >
            <NotificationComponent />
        </>
    );
}

export default Withdrawals;