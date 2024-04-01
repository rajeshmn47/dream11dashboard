import styled from "@emotion/styled";
import { Box } from "@mui/material";

import { FURL, URL } from "./../../constants/userconstants";
import { getDisplayDate } from "../../utils/dateformat";
import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "api";

const Container = styled.div`
  display: flex;
  align-items: center;
  .dreamicon {
    display: none;
    height: 20px;
    width: 20px;
    margin-left: 15px;
  }
  .dream {
    display: flex;
    align-items: center;
  }
`;
export function User(props) {
  const { value } = props;
  console.log(value, "vcalue");
  return (
    <Container className="dream">
      <p>{value?.username && value.username}</p>
    </Container>
  );
}

export default User;
