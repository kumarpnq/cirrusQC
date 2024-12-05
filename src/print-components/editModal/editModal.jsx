import { Link } from "react-router-dom";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { FaExternalLinkAlt } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";

// ** components
import FirstSection from "./components/FirstSection";
import SecondSection from "./components/SecondSection";

// ** third party imports
import PropTypes from "prop-types";
import { url } from "../../constants/baseUrl";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "98vw",
  height: "98vh",
  overflow: "scroll",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
  display: "flex",
  flexDirection: "column",
};

const useStyle = makeStyles(() => ({
  dropDowns: {
    height: 25,
    fontSize: "0.8em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
}));

export default function EditModal({
  open,
  handleClose,
  selectedArticle,
  editedSingleArticle,
  setEditedSingleArticle,
  selectedClient,
}) {
  const classes = useStyle();
  return (
    <div style={{ height: "800px !important", overflow: "scroll" }}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h1" fontSize={"1em"}>
              Edit Articles
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              width: "100%",
              border: "1px solid #DDD",
              borderRadius: "4px",
              p: 1,
              height: "100%",
            }}
          >
            <FirstSection
              classes={classes}
              selectedArticle={selectedArticle}
              editedSingleArticle={editedSingleArticle}
              setEditedSingleArticle={setEditedSingleArticle}
            />
            <Divider sx={{ my: 1 }} />
            <SecondSection
              selectedClient={selectedClient}
              selectedArticle={selectedArticle}
            />
            <Typography
              variant="h6"
              component="a"
              display="flex"
              alignItems="center"
              gap={1}
              fontSize="0.9em"
              className="underline text-primary"
            >
              <Link
                to={`/articleview/download-file/${selectedArticle?.link}`}
                target="_blank"
                className="flex"
              >
                View
                <FaExternalLinkAlt style={{ fontSize: "1.2em" }} />
              </Link>
            </Typography>

            {selectedArticle && selectedArticle.default_link && (
              <iframe
                title="PDF Viewer"
                src={`${url}${selectedArticle.default_link}`}
                className={classes.iframe}
                style={{ width: "100%", height: 600 }}
              />
            )}
          </Box>

          {/* Right Section */}
        </Box>
      </Modal>
    </div>
  );
}

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedArticle: PropTypes.array.isRequired,
  editedSingleArticle: PropTypes.array.isRequired,
  setEditedSingleArticle: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
  setTableData: PropTypes.func.isRequired,
  selectedClient: PropTypes.object,
};
