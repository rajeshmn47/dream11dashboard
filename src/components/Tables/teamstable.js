import { Box, Grid } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../../constants/userconstants";
import { getrowClass } from "../../utils/getrowclass";
import MatchesJoined from "./matchesjoined";
import CreatedAt from "./createdat";
import "./users.css";
import User from "./user";
import MDTypography from "components/MDTypography";

const columns = [
  {
    field: "username",
    headerName: "USER",
    width: 180,
    hide: true,
    editable: true
  },
  {
    field: "email",
    headerName: "EMAIL",
    width: 180,
    hide: true,
    editable: true
  },
  {
    field: "createdAt",
    headerName: "CREATED AT",
    width: 180,
    editable: true,
    renderCell: CreatedAt,
  },
];

const ODD_OPACITY = 0.2;
const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: "#fef4de",
    ".dreamicon": {
      display: "block",
    },
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.prime`]: {
    backgroundColor: "#fef4de",
    ".dreamicon": {
      display: "block",
    },
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
  [`& .${gridClasses.row}.sikh`]: {
    ".dreamicon": {
      display: "block",
    },
    "&:hover, &.Mui-hovered": {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
    },
    "&.Mui-selected": {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity
      ),
      "&:hover, &.Mui-hovered": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY + theme.palette.action.selectedOpacity + theme.palette.action.hoverOpacity
        ),
        // Reset on touch devices, it doesn't add specificity
        "@media (hover: none)": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity
          ),
        },
      },
    },
  },
}));

export function Team({ teams }) {
  const [match, setMatch] = useState(null);
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllplayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dreamTeam, setDreamTeam] = useState([]);
  const [next, setNext] = useState(false);
  useEffect(() => {
    teams.length > 0 && setLoading(false)
  }, [teams])
  console.log(teams?.map((t) => { return ({ ...t?.team[0], username: t.user[0]?.username }) }), 'teamsee')
  return (
    <>
      <MDTypography variant="h6" color="#344767" className="tabletitlei">
        Teams Table
      </MDTypography>
      <Box sx={{ height: 400, width: "100%", color: "#FFFFFF !important" }} className="container">
        <StripedDataGrid
          loading={loading}
          rows={teams?.map((t) => { return ({ ...t.team[0], username: t.user[0]?.username, email: t.user[0]?.email }) })}
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row._id}
          showCellVerticalBorder
          showColumnVerticalBorder
          columnHeaderHeight={42}
          rowHeight={42}
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                playerId: false,
              },
            },
          }}
        />
      </Box>
    </>
  );
}

export default Team;
