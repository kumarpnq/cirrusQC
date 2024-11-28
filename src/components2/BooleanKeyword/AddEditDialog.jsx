import { Divider, Typography, Box, Modal, IconButton } from "@mui/material";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import QueryBox from "./QueryBox";

import { EditModalActions } from "./EditModalActions";
import { useEffect, useState } from "react";
import axiosInstance from "../../../axiosConfig";
import toast from "react-hot-toast";

const AddEditDialog = ({ open, handleClose, fromWhere, row }) => {
  const [language, setLanguage] = useState("en");
  const [filteredIncludeData, setFilteredIncludeData] = useState([]);
  const [filteredExcludeData, setFilteredExcludeData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const fetchBooleanKeywords = async () => {
    try {
      const response = await axiosInstance.get(
        `companyKeywords/?companyId=${row?.companyId}`
      );

      let localIncludeQuery = response.data.data.data.includeQuery || [];
      let localExcludeQuery = response.data.data.data.excludeQuery || [];

      const filteredIncludeLocalData = localIncludeQuery.filter(
        (item) => item.langId === language
      );
      const filteredExcludeLocalData = localExcludeQuery.filter(
        (item) => item.langId === language
      );
      setFilteredIncludeData(filteredIncludeLocalData);
      setFilteredExcludeData(filteredExcludeLocalData);
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    if (open && fromWhere === "Edit") {
      fetchBooleanKeywords();
    }
  }, [open, row?.companyId, language, fromWhere]);

  return (
    <Modal
      open={open}
      onClose={() => {
        handleClose();
        setFilteredExcludeData([]);
        setFilteredIncludeData([]);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "99vw",
          bgcolor: "background.paper",
          border: "1px solid #000",
          boxShadow: 24,
          height: "99vh",
          overflow: "scroll",
          p: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontSize={"1em"}>{fromWhere} Item</Typography>
          <IconButton
            onClick={() => {
              handleClose();
              setFilteredExcludeData([]);
              setFilteredIncludeData([]);
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Divider />
          <EditModalActions
            language={language}
            setLanguage={setLanguage}
            row={row}
            fromWhere={fromWhere}
            selectedFullClient={selectedClient}
            setSelectedFullClient={setSelectedClient}
          />
          <QueryBox
            type={"Include Query"}
            row={row}
            language={language}
            filteredExcludeData={filteredExcludeData}
            filteredIncludeData={filteredIncludeData}
            fetchData={fetchBooleanKeywords}
            selectedFullClient={selectedClient}
            fromWhere={fromWhere}
          />
          {/* exclude query */}
          <QueryBox
            type={"Exclude Query"}
            row={row}
            language={language}
            filteredExcludeData={filteredExcludeData}
            filteredIncludeData={filteredIncludeData}
            fetchData={fetchBooleanKeywords}
            selectedFullClient={selectedClient}
            fromWhere={fromWhere}
          />
        </Box>
        <Divider />
      </Box>
    </Modal>
  );
};

AddEditDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  fromWhere: PropTypes.string.isRequired,
  row: PropTypes.shape({
    companyId: PropTypes.string.isRequired,
    companyName: PropTypes.string,
  }).isRequired,
};
export default AddEditDialog;
