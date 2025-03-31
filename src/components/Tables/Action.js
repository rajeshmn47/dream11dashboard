import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { getDisplayDate } from "utils/dateformat";
import { FURL } from "./../../constants/userconstants";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";

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
export function Action(props) {
  console.log(props, 'props')
  const navigate = useNavigate();
  const { matchId } = props.row;
  const { onEdit } = props;

  return (
    <Container>
      <MDBox ml={-1} onClick={() => navigate(`/matchDetails/${matchId}`)} className="mdbox">
        <MDBadge badgeContent="view" color="success" variant="gradient" size="sm" />
      </MDBox>
      <Button variant="contained" color="primary" size="small" sx={{ ml: 1, color: '#fff' }} onClick={() => onEdit(props.row)}>
        Edit
      </Button>
    </Container>
  );
}

export default Action;

Action.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  hasFocus: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
};
