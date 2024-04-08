import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Details from "./DetailSection";
import ArticleView from "./ArticleView";

const UploadDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography> Article Edit</Typography>
        <Button>Close</Button>
      </DialogTitle>
      <DialogContent>
        <Details />
        <ArticleView />
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
