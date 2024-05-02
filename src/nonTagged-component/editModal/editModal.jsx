import { useContext, useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";

// ** components
import FirstSection from "./components/FirstSection";
import SecondSection from "./components/SecondSection";

// ** third party imports
import PropTypes from "prop-types";
import { url } from "../../constants/baseUrl";
import axios from "axios";
import { ResearchContext } from "../../context/ContextProvider";

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
  p: 4,
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
    width: "100%", // Make the iframe fill the entire width of the modal content
    height: "100%", // Make the iframe fill the entire height of the modal content
    border: "none", // Remove border around iframe
  },
}));

export default function EditModal({
  open,
  handleClose,
  selectedArticle,
  editedSingleArticle,
  setEditedSingleArticle,
}) {
  const articleId = selectedArticle?.articleid;
  const { userToken } = useContext(ResearchContext);
  // first section states

  // second section states
  const [fetchedArticleHeader, setFetchedArticleHeader] = useState(null);
  const [selectedClient, setSelectedClient] = useState("");

  //  fetch header data manually
  useEffect(() => {
    const fetchArticleHeader = async () => {
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axios.get(
        `${url}articleheader/?article_id=${articleId}`,
        { headers }
      );
      setFetchedArticleHeader(response.data.article[0]);
    };
    fetchArticleHeader();
  }, [selectedArticle, articleId, userToken]);

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
            <Button onClick={handleClose}>close</Button>
          </Box>
          <div className="flex">
            <Box sx={{ width: "60%" }}>
              <FirstSection
                classes={classes}
                selectedArticle={fetchedArticleHeader}
                setEditedSingleArticle={setEditedSingleArticle}
              />
              <SecondSection
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                selectedArticle={selectedArticle}
                editedSingleArticle={editedSingleArticle}
              />
            </Box>
            <Box sx={{ width: "50%" }}>
              {selectedArticle && selectedArticle.link && (
                <iframe
                  title="PDF Viewer"
                  src={`${selectedArticle?.link.replace(/^'|'$/g, "")}`}
                  className={classes.iframe}
                />
              )}
            </Box>
          </div>
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
};
