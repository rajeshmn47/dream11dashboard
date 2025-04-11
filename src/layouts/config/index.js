import React, { useEffect, useState } from "react";
import {
    Grid,
    Card,
    TextField,
    MenuItem,
    Button,
    CircularProgress,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { API } from "api";
import { URL } from "constants/userconstants";

function Configuration() {
    const [config, setConfig] = useState({
        name: "",
        tier: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function getConfig() {
            const { data } = await API.get(`${URL}/api/config`)
            if (data?.configs?.length > 0) {
                setConfig(data?.configs?.[0])
            }
        }
        getConfig()
    }
        , [])

    const handleChange = (e) => {
        setConfig({ ...config, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await API.post(`${URL}/api/config`, {
                ...config
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Saved Config:", result);
            } else {
                console.error("Failed to save config");
            }
        } catch (error) {
            console.error("Error saving config:", error);
        } finally {
            setLoading(false);
        }
    };

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
                                bgColor="dark"
                                borderRadius="lg"
                                coloredShadow="dark"
                            >
                                <MDTypography variant="h6" color="white">
                                    Site Configuration
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={3} px={3} pb={4}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            fullWidth
                                            label="App Name"
                                            name="name"
                                            value={config.name}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="API Usage Tier"
                                            name="tier"
                                            value={config.tier}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="Free">Free</MenuItem>
                                            <MenuItem value="Pro">Pro</MenuItem>
                                            <MenuItem value="Enterprise">Enterprise</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSave}
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default Configuration;
