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

export default function data({ wcolumnData, handleWView, handleApprove, handleDecline }) {
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



  return {
    wcolumns: [
      { Header: "user", accessor: "author", width: "45%", align: "left" },
      { Header: "upi id", accessor: "function", align: "left" },
      { Header: "amount", accessor: "amount", align: "center" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "action", accessor: "action", align: "center" },
    ],

    wrows: wcolumnData?.length > 0 ? [...wcolumnData?.map((c) => {
      return {
        author: <Author image={c?.user?.[0]?.image} name={c?.user[0]?.username} email={c?.user[0]?.email} />,
        function: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {c.upiId}
          </MDTypography>
        ),
        amount: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            {c.amount}
          </MDTypography>
        ),
        status: (
          <MDTypography component="a" href="#" variant="caption" color="text" fontWeight="medium">
            <MDBox><MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {c.status}
            </span>} color="success" variant="gradient" size="sm" />
            </MDBox>
          </MDTypography >
        ),
        action: (
          <MDBox display="flex" justifyContent="center">
            {c.status == "pending" ?
              <><MDBox ml={1} sx={{ cursor: 'pointer' }} onClick={() => handleWView(c)}>
                <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  approve
                </span>} color="success" variant="gradient" size="sm" />
              </MDBox>
                <MDBox ml={1} sx={{ cursor: 'pointer' }} onClick={() => handleWView(c)}>
                  <MDBadge badgeContent={<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    reject
                  </span>} color="error" variant="gradient" size="sm" />
                </MDBox>
                <MDBox ml={1} onClick={() => handleWView(c)} className="mdbox">
                  <MDBadge badgeContent="view" color="success" variant="gradient" size="sm" />
                </MDBox>
              </>
              : <MDBox ml={1}>—</MDBox>}
          </MDBox>
        ),
      }
    })] : []
  };
}
