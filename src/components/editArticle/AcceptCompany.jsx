import PropTypes from "prop-types";
import {
  Box,
  Modal,
  Typography,
  Button,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import { toast } from "react-toastify";
import axiosInstance from "../../../axiosConfigOra";
import CloseIcon from "@mui/icons-material/Close";

const CustomToolbar = () => {
  return (
    <GridToolbarContainer
      sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
    >
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

const AcceptCompany = ({
  open,
  handleClose,
  selectedRow,
  articleType,
  // setModifiedRows,
  // setMainTableData,
  setFetchTagDataAfterChange,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [insertLoading, setInsertLoading] = useState(false);
  const accessKey = articleType === "print" ? "article_id" : "socialfeed_id";
  const prominenceKey =
    articleType === "online" ? "prominence" : "manual_prominence";

  useEffect(() => {
    const getDataForArticleOrSocialFeed = async () => {
      try {
        setLoading(true);
        const params = {
          articleId: selectedRow[accessKey],
          articleType,
        };
        const token = localStorage.getItem("user");
        const response = await axios.get(`${url}getcompaniesforarticle/`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });

        const apiData = response.data.socialfeed_details.map((item, index) => ({
          ...item,
          id: index,
          isSelected: false,
        }));

        setRows(apiData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      getDataForArticleOrSocialFeed();
    }
  }, [selectedRow, articleType, open]);

  // const handleSaveRecord = () => {
  //   if (!selectedItem || !selectedRow) {
  //     toast.warning("Please select a row.");
  //     return;
  //   }

  //   const data = {
  //     [accessKey]: selectedRow[accessKey],
  //     company_id: selectedRow.company_id,
  //     company_name: selectedRow.company_name,
  //     keyword: selectedItem.keyword,
  //     [prominenceKey]: selectedItem.prominence,
  //     reporting_subject: selectedItem.reportingSubject,
  //     reporting_tone: selectedItem.sentiment,
  //     qc3_status: "Z",
  //     update_type: "U",
  //   };

  //   setModifiedRows((prevModifiedRows) => {
  //     const existingRecordIndex = prevModifiedRows.findIndex(
  //       (row) =>
  //         row[accessKey] === selectedRow[accessKey] &&
  //         row.company_id === selectedRow.company_id
  //     );

  //     if (existingRecordIndex !== -1) {
  //       const updatedModifiedRows = [...prevModifiedRows];
  //       updatedModifiedRows[existingRecordIndex] = {
  //         ...updatedModifiedRows[existingRecordIndex],
  //         ...data,
  //       };
  //       return updatedModifiedRows;
  //     } else {
  //       return [...prevModifiedRows, data];
  //     }
  //   });

  //   setMainTableData((prevMainTableData) => {
  //     const existingMainTableIndex = prevMainTableData.findIndex(
  //       (row) =>
  //         row[accessKey] === selectedRow[accessKey] &&
  //         row.company_id === selectedRow.company_id
  //     );

  //     if (existingMainTableIndex !== -1) {
  //       const updatedMainTableData = [...prevMainTableData];
  //       updatedMainTableData[existingMainTableIndex] = {
  //         ...updatedMainTableData[existingMainTableIndex],
  //         ...data,
  //       };
  //       return updatedMainTableData;
  //     } else {
  //       return [...prevMainTableData, data];
  //     }
  //   });

  //   handleClose();
  // };

  const handleInsertRecords = async () => {
    try {
      setInsertLoading(true);
      const preparedCombineData = selectedRows.map((item) => ({
        [accessKey]: selectedRow[accessKey],
        company_id: selectedRow.company_id,
        company_name: selectedRow.company_name,
        keyword: item.keyword,
        [prominenceKey]: item.prominence,
        reporting_subject: item.reportingSubject,
        reporting_tone: item.sentiment,
        qc3_status: "Z",
        update_type: "I",
      }));
      const endpoint =
        articleType === "online"
          ? "updatesocialfeedtagdetails/"
          : "insertarticledetails/";
      const response = await axiosInstance.post(endpoint, preparedCombineData);
      if (response.data.result.success.length) {
        toast.success(response.data.result.success[0]?.message);
        setFetchTagDataAfterChange((prev) => !prev);
      } else {
        toast.warning(response.data.result.errors[0]?.error);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setInsertLoading(false);
    }
  };

  const columns = [
    {
      field: "companyName",
      headerName: "Company Name",
      width: 250,
      renderCell: (params) => (
        <span style={{ fontSize: "0.9em" }}>{params.value}</span>
      ),
    },
  ];

  const handleRowSelectionChange = (newSelection) => {
    setRowSelectionModel(newSelection);
    const selectedData = newSelection.map((id) =>
      rows.find((row) => row.id === id)
    );
    setSelectedRows(selectedData);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            border: "1px solid #DDD",
            boxShadow: 24,
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
            <Typography
              id="modal-title"
              variant="h6"
              component="h2"
              fontSize={"1em"}
            >
              Company Data
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {!!selectedRows.length && (
            <Button
              size="small"
              variant="outlined"
              onClick={handleInsertRecords}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              {insertLoading && <CircularProgress size={"1em"} />}
              Insert
            </Button>
          )}
          <Divider sx={{ my: 1 }} />
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              loading={loading}
              slots={{ toolbar: CustomToolbar }}
              density="compact"
              checkboxSelection
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={handleRowSelectionChange}
              hideFooterSelectedRowCount
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

AcceptCompany.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  articleType: PropTypes.string.isRequired,
  selectedRow: PropTypes.object,
  setFetchTagDataAfterChange: PropTypes.func,
};

export default AcceptCompany;
