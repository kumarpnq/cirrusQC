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
import ArticleView from "../ArticleView";
import { saveTableSettings } from "../../../constants/saveTableSetting";
import useUserSettings from "../../../hooks/useUserSettings";
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

const StitchModal = ({
  open,
  setOpen,
  articleId,
  isStitch,
  isUnStitch,
  pageNumber,
  setPageNumber,
  fetchTagDetails,
}) => {
  // * user settings
  const userColumnSettings = useUserSettings("print", "StitchMain");
  //* fetch stitched articles
  const [articles, setArticles] = useState([]);
  const [stitchedArticles, setStitchedArticles] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectionModal, setSelectionModal] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [openArticleView, setOpenArticleView] = useState(false);
  const [idForView, setIdForView] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleOpenArticleView = (id) => {
    setIdForView(id);
    setOpenArticleView(true);
  };

  const handleCloseArticleView = () => {
    setIdForView(null);
    setOpenArticleView(false);
  };

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

  const handleClose = () => {
    setArticles([]);
    setOpen(false);
  };
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection);
    setSelectionModal(newSelection);
  };
  const handleSave = async () => {
    try {
      setLoading(true);
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
      if (response.data.status.success.length) {
        // toast.success(
        //   `${response.data?.status?.success?.length} rows ${
        //     isStitch ? "stitched" : "un-stitched"
        //   }.`
        // );
        fetchStitchedArticles();
        setSelectedRows([]);
        setSelectionModal([]);
        fetchTagDetails();
        handleClose();
      }

      if (response.data.status.error.length) {
        toast.error(
          `${response.data.status.error.length} rows ${"are getting error"}.`,
          { position: "bottom-right" }
        );
      }
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getRowClassName = (params) => {
    return stitchedArticles.includes(params.row.id) ? "highlight-row" : "";
  };

  // * page dropdown
  const pageNumbers = articles.map((i) => i.page_number);
  const uniqueNumbers = [...new Set(pageNumbers)].sort((a, b) => a - b);

  // * rows and columns for grid
  const columns = [
    {
      field: "upload_id",
      headerName: "Article ID",
      width: userColumnSettings?.upload_id || 270,
      renderCell: (params) => (
        <Typography
          component={"button"}
          className="underline text-[0.7em]"
          onClick={() => handleOpenArticleView(params.row.link)}
          fontSize={"1em"}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "article_date",
      headerName: "Article Date",
      width: userColumnSettings?.article_date || 150,
    },
    {
      field: "publication_name",
      headerName: "Publication Name",
      width: userColumnSettings?.publication_name || 160,
    },
    {
      field: "headlines",
      headerName: "Headline",
      width: userColumnSettings?.headlines || 300,
    },
    {
      field: "page_number",
      headerName: "Page No",
      width: userColumnSettings?.page_number || 100,
    },
    {
      field: "reporting_subject",
      headerName: "Reporting Subject",
      width: userColumnSettings?.reporting_subject || 200,
    },
  ];
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

  // * column resize
  const handleColumnResize = (params) => {
    let field = params.colDef.field;
    let width = params.width;
    saveTableSettings("print", "StitchMain", field, width);
  };

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
    <>
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
                  <Button
                    onClick={handleSave}
                    btnText={isStitch ? "Stitch" : "unStitch"}
                    isLoading={loading}
                  />
                </Typography>
              </Box>
              <Box sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5, 10, 20]}
                  checkboxSelection
                  onColumnResize={handleColumnResize}
                  loading={fetchLoading && <CircularProgress />}
                  rowSelectionModel={selectionModal}
                  onRowSelectionModelChange={(ids) => {
                    handleSelectionChange(ids);
                  }}
                  disableDensitySelector
                  disableColumnSelector
                  disableRowSelectionOnClick
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
      <ArticleView
        open={openArticleView}
        setOpen={setOpenArticleView}
        handleClose={handleCloseArticleView}
        id={idForView}
      />
    </>
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
  fetchTagDetails: PropTypes.func,
};
export default StitchModal;
