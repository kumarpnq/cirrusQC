import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import { FaSortAmountUp } from "react-icons/fa";

const RadialMenu = ({ onMoveTop = () => {} }) => {
  return (
    <Tooltip title="Move modified records">
      <IconButton onClick={onMoveTop}>
        <FaSortAmountUp />
      </IconButton>
    </Tooltip>
  );
};

RadialMenu.propTypes = {
  onMoveTop: PropTypes.func,
};

export default RadialMenu;
