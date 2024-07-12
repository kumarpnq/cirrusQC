import PropTypes from "prop-types";
import { Box, Modal, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Button from "../../../components/custom/Button";

const groupModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 1,
  pb: 3,
};
const GroupModal = ({ openGroupModal, setOpenGroupModal, selectedItems }) => {
  const handleGroupModalClose = () => {
    setOpenGroupModal(false);
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 70 },
    { field: "headline", headerName: "Headline", width: 300, editable: true },
    {
      field: "publication",
      headerName: "Publication",
      width: 200,
      editable: true,
    },
  ];

  const rows = selectedItems.map((item) => ({
    id: item.social_feed_id,
    headline: item.headline,
    publication: item.publication,
  }));
  return (
    <Modal
      open={openGroupModal}
      onClose={handleGroupModalClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={groupModalStyle}>
        <Typography component={Paper} px={1} py={1}>
          Parent Article&apos;s Association
        </Typography>
        <Typography
          component={"div"}
          display={"flex"}
          justifyContent={"space-between"}
          px={1}
          py={1}
        >
          <span>Basic Details</span>
          <span className="flex gap-1">
            <Button btnText="Cancel" />
            <Button btnText="Save" />
          </span>
        </Typography>
        <Box sx={{ height: 400, width: "100%", mt: 1 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                fontSize: "0.875rem",
              },
              "& .MuiDataGrid-cell": {
                fontSize: "0.9em",
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

GroupModal.propTypes = {
  openGroupModal: PropTypes.bool.isRequired,
  setOpenGroupModal: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
};

export default GroupModal;
