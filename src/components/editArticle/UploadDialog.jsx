import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Details from "./DetailSection";
import ArticleView from "./ArticleView";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useContext, useState } from "react";
import ClientSection from "./ClientSection";
import { ResearchContext } from "../../context/ContextProvider";

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
  // p: 4,
  display: "flex",
  flexDirection: "column",
};

const UploadDialog = ({ open, handleClose, selectedRow }) => {
  const { userToken } = useContext(ResearchContext);
  const [selectedCompany, setSelectedCompany] = useState("");
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography> Article Edit</Typography>
          <Button onClick={handleClose}>Close</Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <div className="flex">
              <Details
                selectedRow={selectedRow}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                userToken={userToken}
              />
              <ArticleView selectedArticle={selectedRow} />
            </div>

            {/* client section */}
            <ClientSection
              selectedArticle={selectedRow}
              userToken={userToken}
              selectedCompany={selectedCompany}
            />
          </Box>
        </DialogContent>
      </Box>
    </Modal>
  );
};

UploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
};

export default UploadDialog;
