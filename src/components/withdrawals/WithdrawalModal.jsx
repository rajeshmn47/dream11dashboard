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
    <div>
      abcd
    </div>
  );
}
