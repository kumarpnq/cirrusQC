import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "46%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

const CustomToolbarAI = () => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2">AI Company</Typography>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

const CustomToolbarDB = () => {
  return (
    <GridToolbarContainer
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography variant="body2">DB Company</Typography>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

const MapExtraModal = ({
  open,
  handleClose,
  clientId,
  articleId,
  articleType,
  setFetchTableDataAfterInsert,
  tableData,
}) => {
  const [data, setData] = useState([]);
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiSelectionModal, setAiSelectionModal] = useState([]);
  const [aiSelectedRows, setAiSelectedRows] = useState([]);
  const [dbSelectionModal, setDbSelectionModal] = useState([]);
  const [dbSelectedRows, setDbSelectedRows] = useState([]);

  // * ai company
  useEffect(() => {
    const getDataForArticleOrSocialFeed = async () => {
      try {
        setLoading(true);
        const params = {
          articleId,
          articleType,
        };
        const token = localStorage.getItem("user");
        const response = await axios.get(`${url}getcompaniesforarticle/`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        const respData = response.data.socialfeed_details;

        setData(respData);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    const getDatabaseCompanyForArticleOrSocialFeed = async () => {
      try {
        setLoading(true);
        const params = {
          client_id: clientId,
          article_id: articleId,
          article_type: articleType,
        };
        const token = localStorage.getItem("user");
        const response = await axios.get(`${url}qc3CompanyList/`, {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setDbData(response.data.companies);
      } catch (error) {
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (open) {
      getDataForArticleOrSocialFeed();
      getDatabaseCompanyForArticleOrSocialFeed();
    }
  }, [articleId, articleType, open, clientId]);

  const [insertLoading, setInsertLoading] = useState(false);

  const handleInsert = async () => {
    try {
      setInsertLoading(true);
      const token = localStorage.getItem("user");
      const uniqueDbSelectedRows = dbSelectedRows.filter((row) => {
        return !tableData.some(
          (tableRow) =>
            tableRow.company_id === row.companyId &&
            tableRow.articleType === articleType
        );
      });

      const duplicatesRemoved =
        dbSelectedRows.length - uniqueDbSelectedRows.length;

      if (duplicatesRemoved > 0) {
        toast.warning(`${duplicatesRemoved} duplicate records removed.`);
      }

      if (uniqueDbSelectedRows.length === 0) {
        toast.info("No new records to insert after removing duplicates.");
        return;
      }
      const aiRow = aiSelectedRows[0];
      const dataForOnline = dbSelectedRows.map((item) => ({
        updateType: "I",
        socialFeedId: articleId,
        companyId: item.companyId,
        companyName: item.companyName,
        keyword: aiRow.keyword,
        reportingTone: aiRow.reportingTone,
        reportingSubject: aiRow.reportingSubject,
        // subCategory: aiRow.subcategory,
        prominence: aiRow.prominence,
        // summary: aiRow.detail_summary,
        // qc2Remark: aiRow.remarks,
        qc3_status: "Z",
      }));

      const preparedOnlineData = { data: dataForOnline, qcType: "QC2" };
      const dataForPrint = dbSelectedRows.map((item) => ({
        articleId: articleId,
        companyId: item.companyId,
        companyName: item.companyName,
        manualProminence: aiRow.prominence,
        // headerSpace: aiRow.headerSpace,
        // space: aiRow.space,
        reportingTone: aiRow.reportingTone,
        reportingSubject: aiRow.reportingSubject,
        // subcategory: aiRow.subcategory,
        keyword: aiRow.keyword,
        // qc2Remark: aiRow.qc2_remark,
        // detailSummary: aiRow.detail_summary,
        qc3_status: "Z",
      }));
      const requestData =
        articleType === "online" ? preparedOnlineData : dataForPrint;

      const endpoint =
        articleType === "online"
          ? "updatesocialfeedtagdetails/"
          : "insertarticledetails/";
      const response = await axios.post(`${url + endpoint}`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.result.success.length) {
        toast.info(
          `${response.data.result.success.length} records inserted successfully.`
        );
        setFetchTableDataAfterInsert((prev) => !prev);
        setAiSelectionModal([]);
        setDbSelectionModal([]);
        setAiSelectedRows([]);
        setDbSelectedRows([]);
      } else {
        toast.info(
          `${response.data.result.errors.length}  records not inserted.`
        );
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setInsertLoading(false);
    }
  };

  const aiRows = data.map((item, index) => ({
    id: index + 1,
    companyId: item.companyId,
    companyName: item.companyName,
    keyword: item.keyword,
    reportingTone: item.sentiment,
    prominence: item.prominence,
    reportingSubject: item.reportingSubject,
    qc3Status: item.qc3_status,
  }));

  const dbRows = dbData.map((item, index) => ({
    id: index,
    companyId: item.companyid,
    companyName: item.companyname,
  }));

  const aiColumns = [
    {
      field: "companyName",
      title: "Company Name",
      width: 200,
    },
  ];

  const getSelectedRows = (selection, rows) => {
    return rows.filter((row) => selection.includes(row.id));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          fontSize={"1em"}
        >
          Map Extra
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            // flexWrap: "wrap",
          }}
        >
          <Paper
            elevation={4}
            sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
          >
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={aiRows}
                columns={aiColumns}
                pageSize={5}
                checkboxSelection
                loading={loading}
                slots={{ toolbar: CustomToolbarAI }}
                rowSelectionModel={aiSelectionModal}
                onRowSelectionModelChange={(selection) => {
                  if (selection.length > 1) {
                    const selectionSet = new Set(aiSelectionModal);
                    const result = selection.filter(
                      (s) => !selectionSet.has(s)
                    );
                    setAiSelectionModal(result);
                    setAiSelectedRows(getSelectedRows(result, aiRows));
                  } else {
                    setAiSelectionModal(selection);
                    setAiSelectedRows(getSelectedRows(selection, aiRows));
                  }
                }}
                density="compact"
                hideFooterSelectedRowCount
              />
            </div>
          </Paper>

          <Paper
            elevation={4}
            sx={{ borderRadius: "10px", padding: "20px", overflow: "hidden" }}
          >
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={dbRows}
                columns={aiColumns}
                pageSize={5}
                checkboxSelection
                loading={loading}
                slots={{ toolbar: CustomToolbarDB }}
                rowSelectionModel={dbSelectionModal}
                onRowSelectionModelChange={(selection) => {
                  setDbSelectionModal(selection);
                  const selectedRows = getSelectedRows(selection, dbRows);
                  setDbSelectedRows(selectedRows);
                }}
                density="compact"
                hideFooterSelectedRowCount
              />
            </div>
          </Paper>
        </Box>
        <Divider sx={{ my: 1 }} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            color="primary"
            size="small"
          >
            Close
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleInsert}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            {insertLoading && <CircularProgress size={"1em"} />} Insert
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

MapExtraModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  clientId: PropTypes.string.isRequired,
  articleId: PropTypes.number.isRequired,
  articleType: PropTypes.string.isRequired,
  setFetchTableDataAfterInsert: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
};

export default MapExtraModal;
