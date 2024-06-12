import PropTypes from "prop-types";
import { IconButton, Tooltip } from "@mui/material";
import { FaLongArrowAltUp, FaRegEdit } from "react-icons/fa";
import { Planet } from "react-planet";

const RadialMenu = ({ onMoveTop = () => {}, totalRows, modifiedRows }) => {
  const pendingRows = totalRows - modifiedRows;

  return (
    <div className="z-50">
      <Planet
        centerContent={
          <IconButton sx={{ right: 0, bottom: 2 }}>
            <FaRegEdit />
          </IconButton>
        }
        hideOrbit
        autoClose
        orbitRadius={60}
        bounceOnClose
        rotation={105}
        bounceDirection="BOTTOM"
      >
        <Tooltip title="Move Modified Rows">
          <IconButton sx={{ right: 0, bottom: 2 }} onClick={onMoveTop}>
            <FaLongArrowAltUp />
          </IconButton>
        </Tooltip>

        <Tooltip title="Total Rows">
          <IconButton sx={{ right: 0, bottom: 2 }}>{totalRows}</IconButton>
        </Tooltip>

        <Tooltip title="Modified Rows">
          <IconButton sx={{ right: 0, bottom: 2 }}>{modifiedRows}</IconButton>
        </Tooltip>

        <Tooltip title="Pending Rows">
          <IconButton sx={{ right: 0, bottom: 2 }}>{pendingRows}</IconButton>
        </Tooltip>
      </Planet>
    </div>
  );
};

RadialMenu.propTypes = {
  onMoveTop: PropTypes.func,
  totalRows: PropTypes.number.isRequired,
  modifiedRows: PropTypes.number.isRequired,
};

export default RadialMenu;
