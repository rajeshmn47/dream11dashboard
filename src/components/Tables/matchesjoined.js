import styled from "@emotion/styled";
import { Box } from "@mui/material";

import { FURL } from "../../constants/userconstants";

const Container = styled.div`
  display: flex;
  align-items: center;
  color: #7b809a;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
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
export function MatchesJoined(props) {
  const { hasFocus, value } = props;

  return (
    <Container className="dream">
      <p>{value?.length}</p>
      <img className="dreamicon" src={`${FURL}/dreamteam.jpeg`} />
    </Container>
  );
}

export default MatchesJoined;
