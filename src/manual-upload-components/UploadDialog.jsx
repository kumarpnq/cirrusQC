import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Details from "./DetailSection";
import ArticleView from "./ArticleView";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Grid } from "@mui/material";
import { useState } from "react";

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
  display: "flex",
  flexDirection: "column",
};

const UploadDialog = ({
  open,
  handleClose,
  selectedRow,
  setSelectedRow,
  type,
  // link,
  // setLink,
  setIsArticleSaved,
  errorList,
  articleNumber,
  setArticleNumber,
}) => {
  const [link, setLink] = useState("");

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setSelectedRow(null);
      }}
    >
      <Box sx={style}>
        <DialogTitle
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography> Article Edit</Typography>
          <Button
            onClick={() => {
              handleClose();
              setSelectedRow(null);
            }}
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" height="100%">
                <Details
                  selectedRow={selectedRow}
                  type={type}
                  articleURL={link}
                  setArticleURL={setLink}
                  setIsArticleSaved={setIsArticleSaved}
                  errorList={errorList}
                  articleNumber={articleNumber}
                  setArticleNumber={setArticleNumber}
                  setLink={setLink}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexDirection="column" height="100%">
                <ArticleView link={link} isResponsive={false} />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Box>
    </Modal>
  );
};

UploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRow: PropTypes.object.isRequired,
  type: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  setLink: PropTypes.func.isRequired,
  setIsArticleSaved: PropTypes.func.isRequired,
  errorList: PropTypes.array.isRequired,
  articleNumber: PropTypes.number.isRequired,
  setArticleNumber: PropTypes.func.isRequired,
  setSelectedRow: PropTypes.func,
};

export default UploadDialog;
