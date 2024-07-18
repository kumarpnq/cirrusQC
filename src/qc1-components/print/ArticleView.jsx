import { useState } from "react";
import { Box, Modal } from "@mui/material";

const ArticleView = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button onClick={handleOpen}>Open Full-Screen Modal</button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "99vw",
            height: "99vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          test
        </Box>
      </Modal>
    </div>
  );
};

export default ArticleView;
