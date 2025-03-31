import { useEffect, useState } from "react";
import { Box, CircularProgress, Button, Card, Grid, TextField, IconButton, Switch, FormControlLabel, MenuItem } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { API } from "api";
import { URL } from "constants/userconstants";
import { Delete, Edit, CheckSharp } from "@mui/icons-material";

function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [multipleKeys, setMultipleKeys] = useState([]);
  const [editApiKey, setEditApiKey] = useState(null);
  const [editApiKeyValue, setEditApiKeyValue] = useState("");
  const [multipleKeysMode, setMultipleKeysMode] = useState(true);
  const [usageTier, setUsageTier] = useState("medium");

  useEffect(() => {
    fetchTier();
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    setLoading(true);
    try {
      const response = await API.get(`${URL}/apiKeys/all`);
      setApiKeys(response.data.apiKeys || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTier = async () => {
    setLoading(true);
    try {
      const response = await API.get(`${URL}/apiKeys/getTier`);
      setUsageTier(response.data.usageTier || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddApiKey = () => {
    if (!newApiKey) return;
    setMultipleKeys([...multipleKeys, { apiKey: newApiKey }]);
    setNewApiKey("");
  };

  const handleEditKey = (index, newKey) => {
    const updatedKeys = multipleKeys.map((key, i) => (i === index ? { ...key, apiKey: newKey } : key));
    setMultipleKeys(updatedKeys);
  };

  const handleDeleteKey = (index) => {
    const updatedKeys = multipleKeys.filter((_, i) => i !== index);
    setMultipleKeys(updatedKeys);
  };

  const handleSaveMultipleKeys = async () => {
    if (multipleKeys.length === 0) return;
    setLoading(true);
    try {
      await API.post(`${URL}/apikeys/multiple`, { keys: multipleKeys, usageTier });
      setMultipleKeys([]);
      fetchApiKeys();
    } catch (error) {
      console.error("Error saving multiple API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditApiKey = async (id) => {
    if (!editApiKeyValue) return;
    setLoading(true);
    try {
      await API.put(`${URL}/apikeys/update/${id}`, { apiKey: editApiKeyValue });
      setEditApiKey(null);
      setEditApiKeyValue("");
      fetchApiKeys();
    } catch (error) {
      console.error("Error editing API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApiKey = async (id) => {
    setLoading(true);
    try {
      await API.delete(`${URL}/apikeys/delete/${id}`);
      fetchApiKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsageTier = async () => {
    setLoading(true);
    try {
      await API.put(`${URL}/apiKeys/updateUsageTier`, { usageTier });
      fetchApiKeys();
    } catch (error) {
      console.error("Error updating usage tier:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                mb={4}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  API Key Management
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="API Usage Frequency"
                      fullWidth
                      value={usageTier}
                      onChange={(e) => setUsageTier(e.target.value)}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "50px", // Increase height
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "20px"
                        },
                        "& .MuiSelect-select": {
                          padding: "14px", // More padding for better touch experience
                          minHeight: "50px", // Ensures uniform height
                        }
                      }}
                    >
                      <MenuItem value="slow">Slow</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="fast">Fast</MenuItem>
                      <MenuItem value="fastest">Fastest</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleUpdateUsageTier}
                      disabled={loading}
                    >
                      Update Usage Tier
                    </Button>
                  </Grid>
                </Grid>
                <FormControlLabel
                  control={<Switch checked={multipleKeysMode} onChange={() => setMultipleKeysMode(!multipleKeysMode)} />}
                  label="Add Multiple Keys"
                />
                {multipleKeysMode ? (
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="New API Key"
                        fullWidth
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleAddApiKey}
                        disabled={loading}
                      >
                        Add API Key
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSaveMultipleKeys}
                        disabled={loading}
                      >
                        Save All Keys
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      {multipleKeys.map((key, index) => (
                        <Card key={index}>
                          <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                            <TextField
                              fullWidth
                              value={key.apiKey}
                              onChange={(e) => handleEditKey(index, e.target.value)}
                            />
                            <Box>
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteKey(index)}
                                disabled={loading}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </MDBox>
                        </Card>
                      ))}
                    </Grid>
                  </Grid>
                ) : (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        label="New API Key"
                        fullWidth
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleAddApiKey}
                        disabled={loading}
                      >
                        Add API Key
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <CircularProgress />
                  </Box>
                ) : (
                  <Grid container spacing={2} mt={3}>
                    {apiKeys.map((apiKey) => (
                      <Grid item xs={12} key={apiKey._id}>
                        <Card>
                          <MDBox p={2} display="flex" justifyContent="space-between" alignItems="center">
                            {editApiKey === apiKey._id ? (
                              <TextField
                                fullWidth
                                value={editApiKeyValue}
                                onChange={(e) => setEditApiKeyValue(e.target.value)}
                              />
                            ) : (
                              <MDTypography variant="body1">{apiKey.apiKey}</MDTypography>
                            )}
                            <Box>
                              {editApiKey === apiKey._id ? (
                                <IconButton
                                  color="primary"
                                  onClick={() => handleEditApiKey(apiKey._id)}
                                  disabled={loading}
                                >
                                  <CheckSharp />
                                </IconButton>
                              ) : (
                                <IconButton
                                  color="primary"
                                  onClick={() => {
                                    setEditApiKey(apiKey._id);
                                    setEditApiKeyValue(apiKey.apiKey);
                                  }}
                                >
                                  <Edit />
                                </IconButton>
                              )}
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteApiKey(apiKey._id)}
                                disabled={loading}
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </MDBox>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
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

export default ApiKeyManagement;