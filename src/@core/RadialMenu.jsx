import { IconButton, Tooltip } from "@mui/material";
import { FaLongArrowAltUp, FaRegEdit } from "react-icons/fa";
import { Planet } from "react-planet";

const RadialMenu = () => {
  return (
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
      <Tooltip title="Move Modified">
        <IconButton sx={{ right: 0, bottom: 2 }}>
          <FaLongArrowAltUp />
        </IconButton>
      </Tooltip>

      <IconButton sx={{ right: 0, bottom: 2 }}>
        <FaRegEdit />
      </IconButton>
      <IconButton sx={{ right: 0, bottom: 2 }}>
        <FaRegEdit />
      </IconButton>
    </Planet>
  );
};

export default RadialMenu;
