import styled from "@emotion/styled";
import { getDisplayDate } from "utils/dateformat";
import { FURL } from "../../constants/userconstants";
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
export function CreatedAt(props) {
  const { value } = props;
  return (
    <Container className="dream">
      <p>{getDisplayDate(value?.createdAt, "sc", new Date())}</p>
      <img className="dreamicon" src={`${FURL}/dreamteam.jpeg`} />
    </Container>
  );
}

export default CreatedAt;

CreatedAt.propTypes = {
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
