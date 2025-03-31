import React, { useEffect, useState } from "react";
import { Drawer, Grid, Card } from "@mui/material";
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

const DeatilTop = styled.div`
  margin-top: 10px;
  text-align: center;
  padding: 10px 0;
  p {
    color: rgba(0, 0, 0, 0.6);
    text-transform: uppercase;
  }
`;

function Withdrawals() {
    const [wcolumnData, setWColumnData] = useState([]);
    const [selected, setSelected] = useState({ open: false, data: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchWithdrawals() {
            setLoading(true);
            const response = await API.get(`${URL}/payment/withdrawData`);
            setWColumnData(response.data.withdrawals);
            setLoading(false);
        }
        fetchWithdrawals();
    }, []);

    const handleWView = (data) => {
        setSelected({ open: true, data });
    };

    const handleApprove = async () => {
        await API.get(`${URL}/payment/approveWithdraw?withdrawId=${selected.data._id}`);
        setSelected({ ...selected, open: false });
        const response = await API.get(`${URL}/payment/withdrawData`);
        setWColumnData(response.data.withdrawals);
    };

    const { wcolumns, wrows } = withdrawalsTableData({ wcolumnData, handleWView });

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
                </Grid>
            </MDBox>
            <Drawer anchor="top" open={selected.open} onClose={() => setSelected({ ...selected, open: false })}>
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
                <ApproveButton color="success" onClick={handleApprove}>
                    Approve
                </ApproveButton>
            </Drawer>
            <Footer />
        </DashboardLayout>
    );
}

export default Withdrawals;