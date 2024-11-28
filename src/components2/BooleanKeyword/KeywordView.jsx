import {
  Box,
  Modal,
  Typography,
  IconButton,
  Divider,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const KeywordView = ({ open, handleClose, row }) => {
  // * queries
  const includeQuery = row?.includeQuery || [];
  const excludeQuery = row?.excludeQuery || [];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="keyword-view-modal-title"
      aria-describedby="keyword-view-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "80vh",
          overflowY: "auto",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
          borderRadius: 2,
        }}
      >
        {/* Modal Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontSize="1em" fontWeight="bold">
            Keyword View
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        {/* Modal Content */}
        <Box
          mt={2}
          sx={{ border: "1px solid #ddd", borderRadius: "3px", p: 1 }}
        >
          <Typography variant="subtitle1" fontWeight="bold" color="primary">
            Include Query
          </Typography>
          {includeQuery.length > 0 ? (
            includeQuery.map((item, index) => (
              <Paper key={index} sx={{ p: 1, mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>{item.langName || "English"}:</strong> {item.query}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" mt={1}>
              No Include Queries Available.
            </Typography>
          )}

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary"
            mt={2}
          >
            Exclude Query
          </Typography>
          {excludeQuery.length > 0 ? (
            excludeQuery.map((item, index) => (
              <Paper key={index} sx={{ p: 1, mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>{item.langName || "English"}:</strong> {item.query}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" color="textSecondary" mt={1}>
              No Exclude Queries Available.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

// Define PropTypes
KeywordView.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  row: PropTypes.shape({
    includeQuery: PropTypes.arrayOf(
      PropTypes.shape({
        langName: PropTypes.string,
        query: PropTypes.string.isRequired,
      })
    ),
    excludeQuery: PropTypes.arrayOf(
      PropTypes.shape({
        langName: PropTypes.string,
        query: PropTypes.string.isRequired,
      })
    ),
  }),
};

// Default Props
KeywordView.defaultProps = {
  row: {
    includeQuery: [],
    excludeQuery: [],
  },
};

export default KeywordView;
