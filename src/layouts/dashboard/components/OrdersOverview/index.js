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

// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { getDisplayDate } from "utils/dateformat";

function OrdersOverview({ allMatches }) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Matches overview
        </MDTypography>
        <MDBox mt={0} mb={2}>

        </MDBox>
      </MDBox>
      <MDBox p={2} sx={{ overflow: 'auto', maxHeight: '400px' }}>
        {allMatches?.map((match) =>
          <TimelineItem
            matchId={match?.id}
            color={match?.result == "live" ? "info" : match?.result == "delayed" ? "error" : match?.result == "completed" ? "success" : "secondary"}
            icon={match?.result == "live" ? "pending" : match?.result == "delayed" ? "dangerous" : match?.result == "completed" ? "verified" : "upcoming"}
            title={`${match?.home?.code?.toUpperCase()}${" "}vs${" "}${match?.away?.code?.toUpperCase()}`}
            dateTime={`${(getDisplayDate(match?.date, "sc", new Date()))}`}
            status={match?.result}
          />)}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
