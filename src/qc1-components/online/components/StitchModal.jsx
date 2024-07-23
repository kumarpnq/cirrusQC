import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useEffect, useState } from "react";

// * third party imports
import axios from "axios";
import PropTypes from "prop-types";

// * constants
import { url } from "../../../constants/baseUrl";
import { toast } from "react-toastify";
import { arrayToString } from "../../../utils/arrayToString";
import Button from "../../../components/custom/Button";
import { Link } from "react-router-dom";
// Styles
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85vw",
  // height: "75vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const columns = [
  {
    field: "upload_id",
    headerName: "Article ID",
    width: 270,
    renderCell: (params) => (
      <Link
        to={`/articleview/download-file/${params.row.link}`}
        target="_blank"
        rel="noopener"
        className="underline"
      >
        {params.value}
      </Link>
    ),
  },
  { field: "article_date", headerName: "Article Date", width: 150 },
  { field: "publication_name", headerName: "Publication Name", width: 160 },
  { field: "headlines", headerName: "Headline", width: 300 },
  { field: "page_number", headerName: "Page No", width: 100 },
  { field: "reporting_subject", headerName: "Reporting Subject", width: 200 },
];

const StitchModal = ({
  open,
  setOpen,
  articleId,
  isStitch,
  isUnStitch,
  pageNumber,
  setPageNumber,
}) => {
  //* fetch stitched articles
  const [articles, setArticles] = useState([]);
  const [stitchedArticles, setStitchedArticles] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);

  useEffect(() => {
    if (!pageNumber || isUnStitch) {
      setFilteredArticles([...articles]);
    } else {
      const data = articles.filter((i) => i.page_number === pageNumber);
      setFilteredArticles(data);
    }
  }, [pageNumber, articles]);

  const fetchStitchedArticles = async () => {
    try {
      setFetchLoading(true);
      const params = {
        article_id: articleId,
      };
      const endpoint =
        (isStitch && "articlestostich/") ||
        (isUnStitch && "getstichedarticles/");
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url + endpoint}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      const getArticles = isUnStitch
        ? response.data.articles
        : response.data.articles.unstiched_articles;
      setArticles(getArticles || []);
      setStitchedArticles(response.data.articles.stiched_articles || []);
    } catch (error) {
      console.log(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchStitchedArticles();
    }
  }, [articleId, open]);

  const rows = filteredArticles.map((item) => ({
    id: item.article_id,
    upload_id: item.upload_id,

    article_date: item.article_date,

    publication_name: item.publication_name,

    headlines: item.headlines,

    page_number: item.page_number,

    reporting_subject: item.reporting_subject,
    link: item.link,
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
        parent_id: articleId,
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
        fetchStitchedArticles();
        setSelectedRows([]);
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const getRowClassName = (params) => {
    return stitchedArticles.includes(params.row.id) ? "highlight-row" : "";
  };

  // * page dropdown
  const pageNumbers = articles.map((i) => i.page_number);
  const uniqueNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

  const PageFilter = () => {
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label" sx={{ mt: -1 }}>
            Page
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={pageNumber}
            label="Page"
            size="small"
            onChange={(e) => setPageNumber(e.target.value)}
            sx={{ width: 90 }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                  fontSize: "0.8em",
                },
              },
            }}
          >
            <MenuItem onClick={() => setPageNumber(null)}>
              {" "}
              <button>Clear</button>
            </MenuItem>
            {uniqueNumbers.map((i) => (
              <MenuItem value={i} key={i}>
                {i}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  };

  // * custom toolbar
  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <GridToolbarFilterButton />

        <Box sx={{ display: "flex", gap: 1 }}>
          {isStitch && <PageFilter />}

          <GridToolbarQuickFilter />
        </Box>
      </GridToolbarContainer>
    );
  }

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
            <Box display="flex" justifyContent={"flex-end"} my={1}>
              <Typography component={"div"}>
                <Button onClick={handleSave} btnText="save" />
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
                disableDensitySelector
                disableColumnSelector
                disableRowSelectionOnClick
                // components={{ Toolbar: GridToolbar }}
                slots={{ toolbar: CustomToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                density="compact"
                getRowClassName={getRowClassName}
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
  pageNumber: PropTypes.any,
  setPageNumber: PropTypes.func,
};
export default StitchModal;
