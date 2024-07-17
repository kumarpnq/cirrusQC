import PropTypes from "prop-types";
import { Box, Modal, Paper, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomTextField from "../../@core/CutsomTextField";
import Button from "../../components/custom/Button";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { url } from "../../constants/baseUrl";
import axios from "axios";
import { arrayToString } from "../../utils/arrayToString";

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
const GroupUnGroupModal = ({
  openGroupModal,
  setOpenGroupModal,
  selectedItems,
  setSelectedItems,
  setSelectionModal,
  groupOrUnGroup,
  fetchMainData,
}) => {
  const handleGroupModalClose = () => {
    setOpenGroupModal(false);
  };

  const [selectionModelForGroup, setSelectionModelForGroup] = useState([]);
  const [headlineForGroup, setHeadlineForGroup] = useState("");

  const handleSelectionChange = (newSelection) => {
    if (newSelection.length > 1) {
      // Select the last item in the new selection
      setSelectionModelForGroup([newSelection[newSelection.length - 1]]);
    } else {
      setSelectionModelForGroup(newSelection);
    }
  };

  const columns = [
    {
      field: "copy",
      headerName: "Copy",
      width: 100,
      renderCell: (params) => (
        <CopyToClipboard text={JSON.stringify(params.row.headline)}>
          <IconButton
            aria-label=""
            onClick={() => setHeadlineForGroup(params.row.headline)}
          >
            <ContentCopyIcon />
          </IconButton>
        </CopyToClipboard>
      ),
    },
    { field: "headline", headerName: "Headline", width: 300 },
    {
      field: "publication",
      headerName: "Publication",
      width: 200,
    },
  ];

  const rows = selectedItems.map((item) => ({
    id: item.social_feed_id,
    headline: item.headline,
    publication: item.publication,
  }));

  const [groupLoading, setGroupLoading] = useState(false);
  const handleGroup = async () => {
    if (!selectionModelForGroup.length) {
      toast.warning("Please select parent article.");
      return;
    }
    const parentId = selectionModelForGroup[0];
    const childrenIds = selectedItems.map((item) => item.social_feed_id) || [];
    const filteredChildrenIds = childrenIds.filter((item) => item !== parentId);

    try {
      setGroupLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = { Authorization: `Bearer ${userToken}` };

      const request_data = {
        parent_id: parentId,
        child_id: filteredChildrenIds,
        headline: headlineForGroup,
      };
      const response = await axios.post(
        `${url}groupsimilarsocialfeeds/`,
        request_data,
        { headers }
      );
      if (response.data.status?.success?.length) {
        toast.success("Articles grouped successfully.");
        setOpenGroupModal(false);
        setHeadlineForGroup("");
        setSelectionModelForGroup([]);
        setSelectedItems([]);
        setSelectionModal([]);
        fetchMainData();
      } else {
        toast.warning("Something went wrong.");
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setGroupLoading(false);
    }
  };

  const handleUnGroup = async () => {
    if (selectedItems.length === 1) {
      toast.warning("Select more than one article.");
      return;
    }
    const parentId = selectionModelForGroup[0];
    const childrenIds = selectedItems.map((item) => item.social_feed_id) || [];
    const filteredChildrenIds = childrenIds.filter((item) => item !== parentId);

    try {
      setGroupLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = { Authorization: `Bearer ${userToken}` };

      const request_data = {
        parent_id: parentId,
        child_id: arrayToString(filteredChildrenIds),
      };
      const response = await axios.post(
        `${url}ungroupsimilarsocialfeeds/`,
        request_data,
        {
          headers,
          // params: request_data,
        }
      );
      if (response.data.status?.success?.length) {
        toast.success("Articles ungrouped successfully.");
        setOpenGroupModal(false);
        setSelectionModelForGroup([]);
        setSelectedItems([]);
        setSelectionModal([]);
        fetchMainData();
      } else {
        toast.warning("Error while un-grouping.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setGroupLoading(false);
    }
  };

  return (
    <>
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
              <Button btnText="Cancel" onClick={handleGroupModalClose} />
              <Button
                btnText={groupLoading ? "saving" : "save"}
                onClick={
                  groupOrUnGroup === "group" ? handleGroup : handleUnGroup
                }
                isLoading={groupLoading}
              />
            </span>
          </Typography>
          {groupOrUnGroup === "group" && (
            <CustomTextField
              value={headlineForGroup}
              setValue={setHeadlineForGroup}
              type={"text"}
              placeholder={"Headline"}
            />
          )}

          <Box sx={{ height: 400, width: "100%", mt: 1 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              checkboxSelection
              rowSelectionModel={selectionModelForGroup}
              disableRowSelectionOnClick
              onRowSelectionModelChange={(ids) => {
                // setSelectionModel(ids);
                handleSelectionChange(ids);
              }}
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
    </>
  );
};

GroupUnGroupModal.propTypes = {
  openGroupModal: PropTypes.bool.isRequired,
  setOpenGroupModal: PropTypes.func.isRequired,
  setSelectedItems: PropTypes.func.isRequired,
  setSelectionModal: PropTypes.func.isRequired,
  selectedItems: PropTypes.array.isRequired,
  groupOrUnGroup: PropTypes.string.isRequired,
  fetchMainData: PropTypes.func.isRequired,
};

export default GroupUnGroupModal;
