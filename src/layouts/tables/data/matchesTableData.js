/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";
import moment from "moment";
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export default function data({ columnData, navigate, onEdit, onDelete }) {
  
  const handleWView = (ca) => {
    //navigate(`/matchDetails/${ca.matchId}`);
    window.open(`/matchDetails/${ca.matchId}`, '_blank');
  };

  return {
    columns: [
      { Header: "match title", accessor: "matchTitle", align: "center" },
      { Header: "format", accessor: "matchType", align: "center" },
      { Header: "status", accessor: "result", align: "center" },
      { Header: "start date", accessor: "startDate", align: "center" },
      { Header: "end date", accessor: "endDate", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    rows: columnData.map((c) => ({
      matchTitle: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c.matchTitle}
        </MDTypography>
      ),
      matchType: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c?.format || c?.matchlive[0]?.format}
        </MDTypography>
      ),
      result: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c?.matchlive[0]?.result || 'upcoming'}
        </MDTypography>
      ),
      startDate: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {moment(c.date).format("DD MMM, HH:mm a")}
        </MDTypography>
      ),
      endDate: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {moment(c.enddate).format("DD MMM, HH:mm a")}
        </MDTypography>
      ),
      action: (
        <MDBox display="flex" justifyContent="center">
          <MDBox ml={-1} sx={{ cursor: 'pointer' }} onClick={() => handleWView(c)}>
            <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              view <ArrowOutwardIcon style={{ fontSize: 18 }} />
            </span>} color="success" variant="gradient" size="sm" />
          </MDBox>
          <MDBox ml={1} onClick={() => onEdit(c)} sx={{ cursor: 'pointer' }}>
            <MDBadge badgeContent="edit" color="info" variant="gradient" size="sm" />
          </MDBox>
          <MDBox ml={1} onClick={() => onDelete(c)} sx={{ cursor: 'pointer' }}>
            <MDBadge badgeContent="delete" color="error" variant="gradient" size="sm" />
          </MDBox>
        </MDBox>
      ),
    })),
  };
}
