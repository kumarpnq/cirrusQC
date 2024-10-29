import {
  Box,
  Modal,
  IconButton,
  Typography,
  Badge,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import StoreIcon from "@mui/icons-material/Store";
import CompanyModal from "./CompanyModal";
import axios from "axios";
import { url } from "../../constants/baseUrl";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "99%",
  bgcolor: "background.paper",
  boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
  p: 4,
  outline: "none",
  maxHeight: "99vh",
  overflowY: "auto",
  background: "#FFF",
}));

export const QC3Modal = ({ open, handleClose, selectedArticle, type }) => {
  const socialFeedId = selectedArticle?.social_feed_id;
  const articleId = selectedArticle?.article_id;
  const [openCompanyModal, setCompanyModal] = useState(false);
  const [automationData, setAutomationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptLoadingId, setAcceptLoadingId] = useState(null);

  const fetchAutomationData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("user");
      const URL_ENDPOINT =
        type === "print"
          ? `${url}getArticleAutoTagDetails/?article_id=${articleId}`
          : `${url}getSocialFeedAutoTagDetails/?socialfeed_id=${socialFeedId}`;
      const response = await axios.get(URL_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAutomationData(
        response.data.socialfeed_details || response.data.article_details || []
      );
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      fetchAutomationData();
    }
  }, [open]);

  const handleAccept = async (row) => {
    try {
      setAcceptLoading(true);

      const token = localStorage.getItem("user");

      const requestData = {
        companyId: row?.company_id,
      };
      if (type === "print") {
        requestData.articleId = articleId;
      } else {
        requestData.socialFeedId = socialFeedId;
      }
      const endpoint =
        type === "print" ? "updateqc3statusprint/" : "updateqc3statusonline/";
      const response = await axios.post(`${url + endpoint}`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.result?.status?.statusCode === 1) {
        toast.success(response.data.result?.status?.message);
        fetchAutomationData();
      } else {
        toast.success(response.data.result?.status?.message);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setAcceptLoading(false);
      setAcceptLoadingId(null);
    }
  };

  const columns = [
    {
      field: "automation",
      headerName: "Automation",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "company_name",
      headerName: "Company",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.row.qc3 === "E") {
          return (
            <Badge badgeContent={selectedCompany && 1} color="primary">
              <IconButton
                onClick={() => {
                  setCompanyModal((prev) => !prev);
                  setSelectedCompany({
                    companyid: params.row.company_id,
                    companyname: params.row.company_name,
                  });
                }}
              >
                <StoreIcon />
              </IconButton>
            </Badge>
          );
        } else if (params.row.qc3 === "N") {
          return (
            <Typography variant="body2" textAlign={"center"} mt={2}>
              No Action
            </Typography>
          );
        } else if (params.row.accepted) {
          return <DoneAllIcon color="success" />;
        } else {
          return (
            <IconButton
              onClick={() => handleAccept(params.row)}
              disabled={acceptLoadingId === params.row.id}
            >
              {acceptLoadingId === params.row.id ? (
                <CircularProgress size={24} />
              ) : (
                <CheckIcon />
              )}
            </IconButton>
          );
        }
      },
    },
    {
      field: "reporting_subject",
      headerName: "Subject",
      width: 150,
    },
    {
      field: "prominence",
      headerName: "Prominence",
      width: 130,
    },
    {
      field: "reporting_tone",
      headerName: "Tone",
      width: 130,
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      width: 130,
    },
    {
      field: "detail_summary",
      headerName: "Summary",
      width: 220,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 150,
    },
  ];

  const rows = automationData.map((row, index) => ({
    id: index + 1,
    automation: row.automation,
    company_name: row.company_name,
    company_id: row.company_id,
    qc3: row.qc3,
    accepted: row.accepted,
    reporting_subject: row.reporting_subject,
    prominence: row.prominence,
    reporting_tone: row.reporting_tone,
    detail_summary: row.detail_summary,
    remarks: row.remarks,
    subcategory: row.subcategory,
  }));

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <GridToolbarFilterButton />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="qc3-modal-title"
        aria-describedby="qc3-modal-description"
      >
        <StyledModalBox>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mx: 1,
            }}
          >
            <Typography
              id="qc3-modal-title"
              variant="h5"
              component="h2"
              gutterBottom
              fontSize={"1em"}
            >
              QC3 Detailed Information
            </Typography>
            <IconButton
              onClick={() => {
                handleClose();
                setAutomationData([]);
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <div style={{ height: 650, width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              getRowClassName={(params) => `qc3-${params.row.qc3}`}
              density="standard"
              pageSize={5}
              rowHeight={60}
              rowsPerPageOptions={[5, 10, 20]}
              slots={{ toolbar: CustomToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              disableSelectionOnClick
              disableRowSelectionOnClick
            />
          </div>
        </StyledModalBox>
      </Modal>
      <CompanyModal
        open={openCompanyModal}
        handleClose={() => {
          setCompanyModal(false);
        }}
        handleFetch={fetchAutomationData}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
        id={type === "print" ? articleId : socialFeedId}
        type={type}
      />
    </div>
  );
};

QC3Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedArticle: PropTypes.shape({
    social_feed_id: PropTypes.string,
    article_id: PropTypes.string,
    company_id: PropTypes.number,
  }).isRequired,
  type: PropTypes.string,
};

export default QC3Modal;
