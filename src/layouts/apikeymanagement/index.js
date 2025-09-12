import { useEffect, useState } from "react";
import { Box, CircularProgress, Button, Card, Grid, TextField, IconButton, Switch, FormControlLabel, MenuItem, Typography, CardContent, ButtonGroup } from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { API } from "api";
import { URL } from "constants/userconstants";
import { Delete, Edit, CheckSharp } from "@mui/icons-material";
import axios from "axios";
import { Line } from "react-chartjs-2";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import { setchartdata } from "utils/chartdata";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import { setbarchartdata } from "utils/chartdata";

function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState([]);
  const [usageCount, setUsageCount] = useState("")
  const [loading, setLoading] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [multipleKeys, setMultipleKeys] = useState([]);
  const [editApiKey, setEditApiKey] = useState(null);
  const [editApiKeyValue, setEditApiKeyValue] = useState("");
  const [multipleKeysMode, setMultipleKeysMode] = useState(true);
  const [usageTier, setUsageTier] = useState("medium");
  // -------------------- State --------------------
  const [cronJobs, setCronJobs] = useState([]);
  const [newCronJobName, setNewCronJobName] = useState("");
  const [newCronJobSchedule, setNewCronJobSchedule] = useState("");
  const [editCronJob, setEditCronJob] = useState(null);
  const [editCronJobName, setEditCronJobName] = useState("");
  const [editCronJobSchedule, setEditCronJobSchedule] = useState("");
  const [chartData, setChartData] = useState([]);
  const [barChartData,setBarChartData] = useState([]);
  const [type, setType] = useState('day')
  const matchTypes = ["Test", "ODI", "T20", "Important"];
  const [frequencies, setFrequencies] = useState({
    Test: 5,
    ODI: 5,
    T20: 5,
    Important: 5,
    NotImportant: 5
  });
  const frequencyOptions = [
    { label: "Every 1 min", value: "*/1 * * * *" },
    { label: "Every 2 min", value: "*/2 * * * *" },
    { label: "Every 5 min", value: "*/5 * * * *" },
    { label: "Every 15 min", value: "*/15 * * * *" },
  ];
  const [selectedFrequencies, setSelectedFrequencies] = useState({
    Test: "*/5 * * * *",
    ODI: "*/5 * * * *",
    T20: "*/5 * * * *",
    Important: "*/5 * * * *",
    NotImportant: "*/5 * * * *"
  })

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchUsageHistory = async () => {
      try {
        setLoading(true);
        const today = new Date();
        const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const res = await API.get(`${URL}/apikeys/usage_history`, {
          params: {
            startDate: last7Days.toISOString(),
            endDate: today.toISOString(),
          },
        });
        setHistory([...res.data.history]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching API usage:", error);
        setLoading(false);
      }
    };

    fetchUsageHistory();
  }, []);

  console.log(history, 'history')

  useEffect(() => {
    if (history.length > 0) {
      setChartData(setchartdata(history, type, 'requests'));
      setBarChartData(setbarchartdata(history,type,'requests'))
    }
  }, [type, history]);

  useEffect(() => {
    fetchApiKeys();
    fetchUsageCount();
  }, []);

  useEffect(() => {
    fetchTier();
  }, []);

  useEffect(() => {
    async function getConfig() {
      const { data } = await API.get(`${URL}/api/config`)
      if (data?.config) {
        setSelectedFrequencies(data?.config?.frequencies)
      }
    }
    getConfig()
  }, [])

  const handleToggleCronJob = async (jobId, currentStatus) => {
    try {
      const res = await axios.patch(`/api/cronjobs/${jobId}/toggle`, {
        status: currentStatus === "active" ? "inactive" : "active",
      });
      setCronJobs((prev) =>
        prev.map((job) =>
          job._id === jobId ? { ...job, status: res.data.status } : job
        )
      );
    } catch (err) {
      console.error("Error toggling cron job:", err);
    }
  };

  const handleDeleteCronJob = async (jobId) => {
    try {
      await axios.delete(`/api/cronjobs/${jobId}`);
      setCronJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (err) {
      console.error("Error deleting cron job:", err);
    }
  };

  // Example: handleSaveCronJob
  const handleSaveCronJob = async (cronJobData) => {
    try {
      const response = await fetch("/api/cronjobs", {
        method: cronJobData._id ? "PUT" : "POST", // PUT if updating, POST if creating
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cronJobData),
      });

      if (!response.ok) {
        throw new Error("Failed to save cron job");
      }

      const savedJob = await response.json();

      // Update frontend state after saving
      setCronJobs((prevJobs) => {
        if (cronJobData._id) {
          // update existing job
          return prevJobs.map((job) =>
            job._id === savedJob._id ? savedJob : job
          );
        } else {
          // add new job
          return [...prevJobs, savedJob];
        }
      });

      alert("Cron job saved successfully ✅");
    } catch (error) {
      console.error("Error saving cron job:", error);
      alert("Failed to save cron job ❌");
    }
  };

  // -------------------- API Calls --------------------

  // Fetch cron jobs
  const fetchCronJobs = async () => {
    try {
      const res = await fetch("/api/cronjobs");
      const data = await res.json();
      setCronJobs(data);
    } catch (err) {
      console.error("Failed to fetch cron jobs", err);
    }
  };

  // Add new cron job
  const handleAddCronJob = async () => {
    if (!newCronJobName || !newCronJobSchedule) return alert("Enter name & schedule");

    setLoading(true);
    try {
      const res = await fetch("/api/cronjobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCronJobName, schedule: newCronJobSchedule }),
      });

      if (res.ok) {
        setNewCronJobName("");
        setNewCronJobSchedule("");
        fetchCronJobs();
      }
    } catch (err) {
      console.error("Error adding cron job", err)
    }
  }

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
      const response = await API.get(`${URL}/apikeys/get_tier`);
      //setUsageTier(response.data.usageTier || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageCount = async () => {
    setLoading(true);
    try {
      const response = await API.get(`${URL}/apikeys/usage`);
      setUsageCount(response.data.usageCount);
    }
    catch (error) {
      console.log("Error", error)
    }
  }

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

  const handleUpdateUsage = async () => {
    setLoading(true);
    try {
      await API.put(`${URL}/apiKeys/updateUsage`, { usageCount: usageCount });
      fetchApiKeys();
    } catch (error) {
      console.error("Error updating usage tier:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (type, value) => {
    setSelectedFrequencies((prev) => ({
      ...prev,
      [type]: value
    }));
  }

  const handleSave = async () => {
    try {
      await API.post(`${URL}/api/config/updateFrequencies`, { frequencies: selectedFrequencies });
      alert("Frequencies saved successfully ✅");
    }
    catch (error) {
      console.error("Error saving frequencies:", error);
      alert("Failed to save frequencies ❌");
    }
    finally {
      setLoading(false);
    }
  }

  console.log(chartData, 'chart data')

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
                <Box sx={{ width: "100%", p: 2 }}>
                  <ButtonGroup
                    variant="contained"
                    aria-label="outlined primary button group"
                    style={{ color: "#FFFFFF !important" }}
                  >
                    <Button
                      onClick={() => setType("1min")}
                      className={type == "1min" ? "selected" : "notselected"}
                    >
                      1 min
                    </Button>
                    <Button
                      onClick={() => setType("5min")}
                      className={type == "5min" ? "selected" : "notselected"}
                    >
                      5 min
                    </Button>
                    <Button
                      onClick={() => setType("hour")}
                      className={type == "hour" ? "selected" : "notselected"}
                    >
                      hour
                    </Button>
                    <Button
                      onClick={() => setType("day")}
                      className={type == "day" ? "selected" : "notselected"}
                    >
                      day
                    </Button>
                    <Button
                      onClick={() => setType("week")}
                      className={type == "week" ? "selected" : "notselected"}
                    >
                      week
                    </Button>
                    <Button
                      onClick={() => setType("month")}
                      className={type == "month" ? "selected" : "notselected"}
                    >
                      month
                    </Button>
                  </ButtonGroup>
                </Box>
                <Box sx={{ width: "100%", p: 2 }}>
                  {loading ? <CircularProgress /> : <ReportsLineChart
                    color="info"
                    title="today's requests"
                    description="Last Campaign Performance"
                    date="campaign sent 2 days ago"
                    chart={chartData}
                  />}
                </Box>
                <Box sx={{ width: "100%", p: 2 }}>
                  <MDBox mb={3}>
                    {barChartData && (
                      <ReportsBarChart
                        color="info"
                        title="today's teams"
                        description="Last Campaign Performance"
                        date="campaign sent 2 days ago"
                        chart={barChartData}
                      />
                    )}
                  </MDBox>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="API usage"
                      fullWidth
                      value={usageCount}
                      onChange={(e) => setUsageCount(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleUpdateUsage}
                      disabled={loading}
                    >
                      Update Usage
                    </Button>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox p={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="API usage"
                      fullWidth
                      value={usageCount}
                      onChange={(e) => setUsageCount(e.target.value)}
                    />
                  </Grid>
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
                      <Grid item xs={12} md={6} key={apiKey._id}>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </MDBox>
            </Card>
          </Grid>
          <Grid item>
            <Box>
              <Typography variant="h5" gutterBottom>
                Cronjob Frequency Settings
              </Typography>
              <Grid container spacing={3}>
                {Object.entries(selectedFrequencies).map(([type, value]) => (
                  <Grid item xs={12} md={6} lg={3} key={type}>
                    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {type.toUpperCase()} Matches
                        </Typography>
                        <TextField
                          type="number"
                          label="Frequency (minutes)"
                          value={value}
                          onChange={(e) => handleChange(type, e.target.value)}
                          fullWidth
                          sx={{ mb: 2 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          How often scores are updated for {type.toUpperCase()} matches.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                  Save Frequencies
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ApiKeyManagement;