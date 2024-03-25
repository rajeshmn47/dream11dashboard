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
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useState } from "react";
// Images
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import "./../../dashboard.css";
import MDProgress from "components/MDProgress";

export default function data({ ucolumnData, contests, teams }) {
  console.log(ucolumnData, 'columnedata');
  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const Job = ({ title, description }) => (
    <MDBox lineHeight={1} textAlign="left">
      <MDTypography display="block" variant="caption" color="text" fontWeight="medium">
        {title}
      </MDTypography>
      <MDTypography variant="caption">{description}</MDTypography>
    </MDBox>
  );
  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );


  return {
    ucolumns: [
      { Header: "username", accessor: "username", align: "left" },
      { Header: "wallet", accessor: "wallet", align: "left" },
      { Header: "teams", accessor: "teamse", align: "left" },
      { Header: "contests", accessor: "contestse", align: "left" },
    ],

    urows: ucolumnData?.length > 0 ? [...ucolumnData?.map((c) => {
      return {
        username: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c?.username}
        </MDTypography>,
        wallet: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c?.wallet}
        </MDTypography>,
        contestse: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {contests?.filter((co) => co.userIds.includes(c?._id)).length}
        </MDTypography>,
        teamse: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {teams?.filter((t) => t?.userId == c?._id).length}
        </MDTypography>
      }
    })] : []
  };
}
