import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Details from "./DetailSection";
import ArticleView from "./ArticleView";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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

const UploadDialog = ({
  open,
  handleClose,
  selectedRow,
  type,
  link,
  setLink,
  setIsArticleSaved,
  errorList,
  articleNumber,
  setArticleNumber,
}) => {
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
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems="center"
            width="100%"
            gap={1}
          >
            <Box flex={1}>
              <Details
                selectedRow={selectedRow}
                type={type}
                articleURL={link}
                setArticleURL={setLink}
                setIsArticleSaved={setIsArticleSaved}
                errorList={errorList}
                articleNumber={articleNumber}
                setArticleNumber={setArticleNumber}
              />
            </Box>
            <Box flex={1}>
              <ArticleView link={link} />
            </Box>
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
  type: PropTypes.number.isRequired,
  link: PropTypes.string.isRequired,
  setLink: PropTypes.func.isRequired,
  setIsArticleSaved: PropTypes.func.isRequired,
  errorList: PropTypes.array.isRequired,
  articleNumber: PropTypes.number.isRequired,
  setArticleNumber: PropTypes.func.isRequired,
};

export default UploadDialog;
