import React, { useEffect, useState } from "react";
import { Grid, Card, TextField, Button, MenuItem } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { API } from "api";
import { URL } from "constants/userconstants";

function Profile() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    contact: "",
    appName: "",
    usageTier: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const response = await API.get(`${URL}/admin/profile`);
        setProfileData(response.data.profile || {});
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await API.put(`${URL}/admin/profile`, profileData);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
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
                <MDTypography variant="h4" color="white">
                  Admin Profile
                </MDTypography>
              </MDBox>
            </Card>
          </Grid>

          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Personal Information
                </MDTypography>
                <TextField
                  label="Name"
                  name="name"
                  fullWidth
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                    },
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                    },
                  }}
                />
                <TextField
                  label="Role"
                  name="role"
                  fullWidth
                  value={profileData.role}
                  disabled
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                    },
                  }}
                />
                <TextField
                  label="Contact"
                  name="contact"
                  fullWidth
                  value={profileData.contact}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                    },
                  }}
                />
              </MDBox>
            </Card>
          </Grid>

          {/* Application Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox p={3}>
                <MDTypography variant="h6" fontWeight="medium" mb={2}>
                  Application Settings
                </MDTypography>
                <TextField
                  label="App Name"
                  name="appName"
                  fullWidth
                  value={profileData.appName}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                    },
                  }}
                />
                <TextField
                  select
                  label="Usage Tier"
                  name="usageTier"
                  fullWidth
                  value={profileData.usageTier}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  margin="normal"
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#f5f5f5",
                      borderRadius: "5px",
                    },
                  }}
                >
                  <MenuItem value="slow">Slow</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="fast">Fast</MenuItem>
                  <MenuItem value="fastest">Fastest</MenuItem>
                </TextField>
              </MDBox>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} display="flex" justifyContent="center" gap={2}>
                {editMode ? (
                  <>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSave}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setEditMode(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Profile;