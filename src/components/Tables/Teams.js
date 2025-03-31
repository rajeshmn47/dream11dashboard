import styled from "@emotion/styled";
import { getDisplayDate } from "utils/dateformat";
import { FURL } from "./../../constants/userconstants";
import PropTypes from "prop-types";

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
export function Teams(props) {
    const { teamHomeCode, teamAwayCode } = props.row;
    return (
        <Container className="dream">
            <p style={{ color: '#43a047', textTransform: 'uppercase', fontWeight: '600' }}>{teamAwayCode}{' '}vs{' '}{teamHomeCode}</p>
        </Container>
    );
}

export default Teams;

Teams.propTypes = {
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
