import PropTypes from "prop-types";
import {
  Box,
  Modal,
  Typography,
  Checkbox,
  Button,
  Divider,
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
  setModifiedRows,
  setMainTableData,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
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

  const handleCustomCheckboxClick = (id) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? { ...row, isSelected: true }
        : { ...row, isSelected: false }
    );

    const selectedRow = updatedRows.find((row) => row.isSelected);
    setRows(updatedRows);
    setSelectedItem(selectedRow || null);
  };

  const handleSaveRecord = () => {
    if (!selectedItem || !selectedRow) {
      toast.warning("Please select a row.");
      return;
    }

    const data = {
      [accessKey]: selectedRow[accessKey],
      company_id: selectedRow.company_id,
      company_name: selectedRow.company_name,
      keyword: selectedItem.keyword,
      [prominenceKey]: selectedItem.prominence,
      reporting_subject: selectedItem.reportingSubject,
      reporting_tone: selectedItem.sentiment,
      qc3_status: "Z",
      update_type: "U",
    };

    setModifiedRows((prevModifiedRows) => {
      const existingRecordIndex = prevModifiedRows.findIndex(
        (row) =>
          row[accessKey] === selectedRow[accessKey] &&
          row.company_id === selectedRow.company_id
      );

      if (existingRecordIndex !== -1) {
        const updatedModifiedRows = [...prevModifiedRows];
        updatedModifiedRows[existingRecordIndex] = {
          ...updatedModifiedRows[existingRecordIndex],
          ...data,
        };
        return updatedModifiedRows;
      } else {
        return [...prevModifiedRows, data];
      }
    });

    setMainTableData((prevMainTableData) => {
      const existingMainTableIndex = prevMainTableData.findIndex(
        (row) =>
          row[accessKey] === selectedRow[accessKey] &&
          row.company_id === selectedRow.company_id
      );

      if (existingMainTableIndex !== -1) {
        const updatedMainTableData = [...prevMainTableData];
        updatedMainTableData[existingMainTableIndex] = {
          ...updatedMainTableData[existingMainTableIndex],
          ...data,
        };
        return updatedMainTableData;
      } else {
        return [...prevMainTableData, data];
      }
    });

    handleClose();
  };

  const columns = [
    {
      field: "customCheckbox",
      headerName: "Select",
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <Checkbox
          checked={params.row.isSelected}
          onChange={() => handleCustomCheckboxClick(params.row.id)}
          inputProps={{ "aria-label": `select ${params.row.companyName}` }}
          size="small"
        />
      ),
    },
    // {
    //   field: "keyword",
    //   headerName: "Keyword",
    //   width: 150,
    //   renderCell: (params) => (
    //     <span style={{ fontSize: "14px" }}>{params.value}</span>
    //   ),
    // },
    // {
    //   field: "companyId",
    //   headerName: "Company ID",
    //   width: 150,
    //   renderCell: (params) => (
    //     <span style={{ fontSize: "0.9em" }}>{params.value}</span>
    //   ),
    // },
    {
      field: "companyName",
      headerName: "Company Name",
      width: 250,
      renderCell: (params) => (
        <span style={{ fontSize: "0.9em" }}>{params.value}</span>
      ),
    },
  ];

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
          <Typography
            id="modal-title"
            variant="h6"
            component="h2"
            fontSize={"1em"}
          >
            Company Data
          </Typography>
          <Box sx={{ textAlign: "end" }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClose}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button size="small" variant="outlined" onClick={handleSaveRecord}>
              Update
            </Button>
          </Box>
          <Divider sx={{ my: 1 }} />
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              loading={loading}
              slots={{ toolbar: CustomToolbar }}
              density="compact"
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
  setModifiedRows: PropTypes.func.isRequired,
  setMainTableData: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
};

export default AcceptCompany;
