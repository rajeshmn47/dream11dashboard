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

export default function data({ wcolumnData }) {
  console.log(wcolumnData, 'columndata');
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
    wcolumns: [
      { Header: "total price", accessor: "price", align: "left" },
      { Header: "winner's percent", accessor: "winners", align: "left" },
      { Header: "prize distribution", width: "20%", accessor: "prizeDistribution", align: "left" },
      { Header: "spots filled", accessor: "function", align: "left" },
      { Header: "total spots", accessor: "totalSpots", align: "center" },
      { Header: "spots filled", accessor: "spotsFilled", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    wrows: wcolumnData?.length > 0 ? [...wcolumnData?.map((c) => {
      return {
        price: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c.price}
        </MDTypography>,
        winners: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {Math.floor((5 / c.totalSpots) * 100)}%
        </MDTypography>,
        prizeDistribution: <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          <MDBadge badgeContent="35%" color="success" variant="gradient" size="sm" />
          <MDBadge badgeContent="25%" color="info" variant="gradient" size="sm" />
          <MDBadge badgeContent="15%" color="warning" variant="gradient" size="sm" />
          <MDBadge badgeContent="10%" color="primary" variant="gradient" size="sm" />
          <MDBadge badgeContent="5%" color="error" variant="gradient" size="sm" />
        </MDTypography>,
        function: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {c?.teamsId?.length}
          </MDTypography>
        ),
        totalSpots: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {c.totalSpots}
          </MDTypography>
        ),
        spotsFilled: <Progress color={((c.totalSpots - c.spotsLeft) / c.totalSpots) * 100 > 50 ? "success" : ((c.totalSpots - c.spotsLeft) / c.totalSpots) * 100 > 20 ? "pending" : "error"}
          value={(Math.floor(((c.totalSpots - c.spotsLeft) / c.totalSpots) * 100))} />,
        action: (
          <MDBox ml={-1} className="mdbox">
            <MDBadge badgeContent="view" color="success" variant="gradient" size="sm" />
          </MDBox>
        ),
      }
    })] : []
  };
}
