import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Details from "./DetailSection";
import ArticleView from "./ArticleView";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ClientSection from "./ClientSection";
import { Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "99vw",
  height: "99vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
  display: "flex",
  flexDirection: "column",
};

const UploadDialog = ({ open, handleClose, selectedRow, selectedClient }) => {
  const userToken = localStorage.getItem("user");
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography>Article Edit</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Typography>
        <Box>
          <Box sx={{ display: "flex" }}>
            <div className="flex flex-col border rounded-md p-[3px]">
              <Details selectedRow={selectedRow} userToken={userToken} />
              <Divider sx={{ my: 0.5 }} />
              <ClientSection
                selectedArticle={selectedRow}
                userToken={userToken}
                selectedClient={selectedClient}
              />
            </div>

            {/* client section */}

            <ArticleView selectedArticle={selectedRow} />
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

UploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  selectedClient: PropTypes.string,
};

export default UploadDialog;
