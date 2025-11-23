import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, CircularProgress } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { API } from "api";
import { URL } from "constants/userconstants";

function CreateContestTypeForm({ open, handleClose, selectedContestType, fetchContestTypes }) {
  const [saving, setSaving] = useState(false); // ⬅ NEW
  const [contestType, setContestType] = useState({
    name: '',
    description: '',
    prize: '',
    totalSpots: '',
    numWinners: '',
    entryFee: '',
    prizes: [],
  });

  useEffect(() => {
    if (selectedContestType) {
      setContestType({
        ...selectedContestType,
        prizes: selectedContestType.prizes || [],
      });
    } else {
      setContestType({
        name: '',
        description: '',
        prize: '',
        totalSpots: '',
        numWinners: '',
        entryFee: '',
        prizes: [],
      });
    }
  }, [selectedContestType]);

  useEffect(() => {
    const numWinners = parseInt(contestType.numWinners, 10);
    if (!isNaN(numWinners) && numWinners > 0) {
      const prizes = Array.from({ length: numWinners }, (_, index) => ({
        rank: index + 1,
        amount: contestType.prizes[index] ? contestType.prizes[index].amount : '',
      }));
      setContestType(prevState => ({ ...prevState, prizes }));
    }
  }, [contestType.numWinners]);

  const handleChange = (e) => {
    setContestType({ ...contestType, [e.target.name]: e.target.value });
  };

  const handlePrizeChange = (index, field, value) => {
    const updatedPrizes = [...contestType.prizes];
    updatedPrizes[index][field] = value;
    setContestType({ ...contestType, prizes: updatedPrizes });
  };

  const removePrize = (index) => {
    const updatedPrizes = contestType.prizes.filter((_, i) => i !== index);
    setContestType({ ...contestType, prizes: updatedPrizes });
  };

  const handleSave = async () => {
    setSaving(true); // ⬅ START LOADING

    try {
      const updatedContestType = {
        name: contestType.name,
        description: contestType.description,
        prize: contestType.prize,
        totalSpots: contestType.totalSpots,
        numWinners: contestType.numWinners,
        entryFee: contestType.entryFee,
        prizes: contestType.prizes.map(prize => ({
          rank: prize.rank,
          amount: parseFloat(prize.amount),
        })),
      };

      if (updatedContestType.prizes.length !== parseInt(updatedContestType.numWinners, 10)) {
        alert("The number of prizes must match the number of winners.");
        setSaving(false); // ⬅ STOP LOADING
        return;
      }

      if (selectedContestType && selectedContestType._id) {
        await API.put(`${URL}/contestTypes/${selectedContestType._id}`, updatedContestType);
      } else {
        await API.post(`${URL}/createContestType`, updatedContestType);
      }

      fetchContestTypes();
      handleClose();
    } catch (error) {
      console.error("Error saving contest type:", error);
    } finally {
      setSaving(false); // ⬅ STOP LOADING ALWAYS
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={!saving ? handleClose : () => {}} // ⬅ disable close while saving
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle style={{ color: '#fff', backgroundColor: "#202940" }}>
        {selectedContestType && selectedContestType._id ? 'Edit Contest Type' : 'Add Contest Type'}
      </DialogTitle>

      <DialogContent style={{ color: '#fff', backgroundColor: "#202940", position: "relative" }}>
        
        {/* ⬅ overlay blur while saving */}
        {saving && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(2px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10
          }}>
            <CircularProgress />
          </div>
        )}

        {/* disable form fields */}
        <fieldset disabled={saving} style={{ border: "none", padding: 0, margin: 0 }}>
          
          <TextField label="Name" fullWidth name="name" value={contestType.name} onChange={handleChange}
            margin="normal" InputLabelProps={{ style: { color: '#fff' }}} InputProps={{ style: { color: '#fff' }}}
          />

          <TextField label="Description" fullWidth name="description" value={contestType.description} onChange={handleChange}
            margin="normal" InputLabelProps={{ style: { color: '#fff' }}} InputProps={{ style: { color: '#fff' }}}
          />

          <TextField label="Prize" fullWidth name="prize" value={contestType.prize} onChange={handleChange}
            margin="normal" InputLabelProps={{ style: { color: '#fff' }}} InputProps={{ style: { color: '#fff' }}}
          />

          <TextField label="Total Spots" fullWidth name="totalSpots" value={contestType.totalSpots} onChange={handleChange}
            margin="normal" InputLabelProps={{ style: { color: '#fff' }}} InputProps={{ style: { color: '#fff' }}}
          />

          <TextField label="Number of Winners" fullWidth name="numWinners" value={contestType.numWinners} onChange={handleChange}
            margin="normal" InputLabelProps={{ style: { color: '#fff' }}} InputProps={{ style: { color: '#fff' }}}
          />

          <TextField label="Entry Fee" fullWidth name="entryFee" value={contestType.entryFee} onChange={handleChange}
            margin="normal" InputLabelProps={{ style: { color: '#fff' }}} InputProps={{ style: { color: '#fff' }}}
          />

          <div>
            <h4 style={{ color: '#fff' }}>Prizes</h4>
            {contestType.prizes.map((prize, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <TextField
                  label="Rank"
                  name="rank"
                  value={prize.rank}
                  margin="normal"
                  disabled
                  InputLabelProps={{ style: { color: '#fff' }}}
                  InputProps={{ style: { color: '#fff' }}}
                  style={{ marginRight: '10px' }}
                />
                <TextField
                  label="Amount"
                  name="amount"
                  value={prize.amount}
                  onChange={(e) => handlePrizeChange(index, 'amount', e.target.value)}
                  margin="normal"
                  InputLabelProps={{ style: { color: '#fff' }}}
                  InputProps={{ style: { color: '#fff' }}}
                  style={{ marginRight: '10px' }}
                />
                <IconButton onClick={() => removePrize(index)} style={{ color: '#fff' }}>
                  <Remove />
                </IconButton>
              </div>
            ))}
          </div>

        </fieldset>
      </DialogContent>

      <DialogActions style={{ backgroundColor: "#202940" }}>
        <Button onClick={handleClose} style={{ color: '#fff' }} disabled={saving}>
          Cancel
        </Button>

        <Button onClick={handleSave} style={{ color: '#fff' }} disabled={saving}>
          {saving ? <CircularProgress size={20} style={{ color: "#fff" }} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateContestTypeForm;
