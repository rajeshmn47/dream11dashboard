import styled from "@emotion/styled";
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
export function Status(props) {
    const { matchlive } = props.row;
    return (
        <MDBox ml={-1} className="mdbox">
            {!(matchlive[0]?.result == 'Complete') ?
                <MDBadge badgeContent={matchlive[0]?.result||'upcoming'} color="success" variant="gradient" size="sm" />
                :
                <MDBadge badgeContent={matchlive[0]?.result} color="primary" variant="gradient" size="sm" />}
        </MDBox>
    );

}

export default Status;

Status.propTypes = {
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
