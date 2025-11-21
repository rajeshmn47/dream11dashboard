// DepositModal.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Grid,
} from "@mui/material";
import axios from "axios";
import { API } from "api";
import { URL } from "constants/userconstants";

export default function WithdrawalModal({ open, onClose, userId, onDeposit, allUsersList }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({ id: userId });

  const handleWithdrawal = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await API.post(`${URL}/admin/withdraw`, {
        userId: user._id,
        amount: Number(amount),
      });
      onDeposit(res.data.balance); // update balance in parent UI
      onClose();
    } catch (err) {
      console.error(err);
      setError("Deposit failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>Withdraw Money</DialogTitle>
      <DialogContent sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Typography variant="body2" color="text.secondary">
            Enter the amount you want to withdraw from user's wallet.
          </Typography>
          <TextField
            type="number"
            label="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
          />
          <Grid item xs={3}>
            <Autocomplete
              options={allUsersList}
              getOptionLabel={(option) => option.username}
              value={allUsersList.find(p => p._id === user._id) || null}
              onChange={(e, newValue) => {
                if (newValue) setUser(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="User Name" fullWidth />}
            />
          </Grid>
        </Box>
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "#344767", color: "#fff", p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleWithdrawal}
          disabled={loading}
        >
          {loading ? "Withdrawing..." : "Withdraw"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
