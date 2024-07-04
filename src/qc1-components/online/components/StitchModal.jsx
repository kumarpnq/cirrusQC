import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

// * third party imports
import axios from "axios";
import PropTypes from "prop-types";

// * constants
import { url } from "../../../constants/baseUrl";
import { toast } from "react-toastify";
import { arrayToString } from "../../../utils/arrayToString";

// Styles
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "75vw",
  // height: "75vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const columns = [
  { field: "article_id", headerName: "Article ID", width: 150 },
  { field: "article_date", headerName: "Article Date", width: 150 },
  { field: "publication_name", headerName: "Publication Name", width: 200 },
  { field: "headlines", headerName: "Headline", width: 300 },
  { field: "page_number", headerName: "Page No", width: 100 },
  { field: "reporting_subject", headerName: "Reporting Subject", width: 200 },
];

const StitchModal = ({ open, setOpen, articleId, isStitch, isUnStitch }) => {
  //* fetch stitched articles
  const [articles, setArticles] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const fetchStitchedArticles = async () => {
    try {
      setFetchLoading(true);
      const params = {
        article_id: articleId, //83600748
      };
      const endpoint =
        (isStitch && "articlestostich/") ||
        (isUnStitch && "getstichedarticles/");
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url + endpoint}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      setArticles(response.data.articles || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchStitchedArticles();
  }, [articleId, open]);

  const rows = articles.map((item) => ({
    id: item.article_id,
    article_id: item.article_id,

    article_date: item.article_date,

    publication_name: item.publication_name,

    headlines: item.headlines,

    page_number: item.page_number,

    reporting_subject: item.reporting_subject,
  }));

  const handleClose = () => {
    setArticles([]);
    setOpen(false);
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
  };
  const handleSave = async () => {
    try {
      const userToken = localStorage.getItem("user");
      const request_data = {
        parent_id: articleId, //83600748
        child_id: arrayToString(selectedRows),
      };
      const endpoint =
        (isStitch && "sticharticle/") || (isUnStitch && "unsticharticle/");
      const response = await axios.post(`${url + endpoint}`, request_data, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (response) {
        toast.success(
          `${selectedRows.length} rows ${
            isStitch ? "stitched" : "un-stitched"
          }.`
        );
        setSelectedRows([]);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="stitch-modal-title"
    >
      <Box sx={style}>
        <Card>
          <CardHeader
            title={
              <Typography component={"span"}>
                {isStitch ? "Stitch Articles" : "UnStitch Articles"}
              </Typography>
            }
            action={
              <IconButton onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            }
          />
          <CardContent>
            <Box
              display="flex"
              justifyContent={isStitch ? "space-between" : "flex-end"}
            >
              <Typography component={"div"}>
                <Button onClick={handleSave}>Save</Button>
                {/* <Button>Cancel</Button> */}
              </Typography>
            </Box>
            <Box sx={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                loading={fetchLoading && <CircularProgress />}
                onRowSelectionModelChange={(ids) => {
                  handleSelectionChange(ids);
                }}
                density="compact"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Modal>
  );
};

StitchModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  articleId: PropTypes.number.isRequired,
  isStitch: PropTypes.bool,
  isUnStitch: PropTypes.bool,
};
export default StitchModal;
