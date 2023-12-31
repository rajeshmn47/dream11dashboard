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

export default function data({wcolumnData,handleWView}) {
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

 

  return {
    wcolumns: [
      { Header: "user", accessor: "author", width: "45%", align: "left" },
      { Header: "upi id", accessor: "function", align: "left" },
      { Header: "amount", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    wrows: [...wcolumnData.map((c)=>{
   return {
        author: <Author image={team2} name="John Michael" email="john@creative-tim.com" />,
        function: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {c.upiId}
            </MDTypography>
          ),
        status: (
        <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
          {c.amount}
          </MDTypography>
        ),
        action: (
          <MDBox ml={-1} onClick={()=>handleWView(c)}>
          <MDBadge badgeContent="view" color="success" variant="gradient" size="sm" />
        </MDBox>
        ),
      }
    })]
  };
}
