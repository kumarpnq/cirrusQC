import { useState } from "react";
import { Modal, Box } from "@mui/material";
import { makeStyles } from "@mui/styles";

// ** components
import FirstSection from "./components/FirstSection";
import SecondSection from "./components/SecondSection";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  height: "90vh",
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
    marginTop: "1em",
  },

  clientForm: {
    width: 300,
  },
  menuPaper: {
    maxHeight: 200,
    width: 200,
    background: "#d4c8c7",
  },
}));

export default function EditModal({ open, handleClose, selectedArticle }) {
  // first section states
  const [selectedPublication, setSelectedPublication] = useState("");
  const [headline, setHeadline] = useState("");
  const [journalist, setJournalist] = useState("");
  const [summary, setSummary] = useState("");
  const [box, setBox] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [pageNumber, setPageNumber] = useState(null);
  const [pageValue, setPageValue] = useState(null);
  const [space, setSpace] = useState(null);
  const [qc1By, setQc1By] = useState("");
  const [qc2By, setQc2By] = useState("");
  const [articleSummary, setArticleSummary] = useState("");

  // second section states
  const [selectedClient, setSelectedClient] = useState("");

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
          <FirstSection
            classes={classes}
            selectedArticle={selectedArticle}
            selectedPublication={selectedPublication}
            setSelectedPublication={setSelectedPublication}
            headline={headline}
            setHeadline={setHeadline}
            journalist={journalist}
            setJournalist={setJournalist}
            summary={summary}
            setSummary={setSummary}
            box={box}
            setBox={setBox}
            photo={photo}
            setPhoto={setPhoto}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            pageValue={pageValue}
            setPageValue={setPageValue}
            space={space}
            setSpace={setSpace}
            qc1By={qc1By}
            setQc1By={setQc1By}
            qc2By={qc2By}
            setQc2By={setQc2By}
            articleSummary={articleSummary}
            setArticleSummary={setArticleSummary}
          />
          <SecondSection
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            selectedArticle={selectedArticle}
          />
        </Box>
      </Modal>
    </div>
  );
}
