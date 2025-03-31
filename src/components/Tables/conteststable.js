import { Box, Grid } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { URL } from "./../../constants/userconstants";
import { getrowClass } from "../../utils/getrowclass";
import CreatedAt from "./createdat";
import MDTypography from "components/MDTypography";
import { API } from "api";

const columns = [
  {
    field: "price",
    headerName: "Total Prize",
    width: 180,
    hide: true,
    editable: true,
  },
  {
    field: "updatedAt",
    headerName: "UPDATED AT",
    width: 180,
    editable: true,
    renderCell: CreatedAt,
  },
  {
    field: "totalSpots",
    headerName: "TOTAL SPOTS",
    width: 180,
    editable: true,
  },
  {
    field: "spotsLeft",
    headerName: "SPOTS LEFT",
    width: 180,
    editable: true,
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

export function Contests({ matchdata, team }) {
  const [match, setMatch] = useState(null);
  const { id } = useParams();
  const [teams, setTeams] = useState([]);
  const [contests, setContests] = useState([]);
  const [players, setPlayers] = useState([]);
  const [allPlayers, setAllplayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dreamTeam, setDreamTeam] = useState([]);
  const [next, setNext] = useState(false);
  useEffect(() => {
    async function getupcoming() {
      setLoading(true);
      const data = await API.get(`${URL}/getallcontests`);
      console.log(data, "data");
      setContests(data.data.contests);
      setLoading(false);
    }
    //();
    getupcoming()
  }, [id]);

  return (
    <>
      <MDTypography variant="h6" color="#344767" className="tabletitlei">
        Contests Table
      </MDTypography>
      <Box sx={{ height: 400, width: "100%", color: "#FFFFFF !important" }} className="container">
        <StripedDataGrid
          loading={loading}
          rows={contests}
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

export default Contests;
