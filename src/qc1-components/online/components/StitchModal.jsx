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
import FromDate from "../../../components/research-dropdowns/FromDate";
import { formattedDate } from "../../../constants/dates";

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
  { field: "articleId", headerName: "Article ID", width: 150 },
  { field: "articleDate", headerName: "Article Date", width: 150 },
  { field: "publicationName", headerName: "Publication Name", width: 200 },
  { field: "headline", headerName: "Headline", width: 300 },
  { field: "pageNo", headerName: "Page No", width: 100 },
  { field: "reportingSubject", headerName: "Reporting Subject", width: 200 },
];
const rows = [
  {
    id: 1,
    articleId: "001",
    articleDate: "2024-01-01",
    publicationName: "Daily News",
    headline: "Breaking News 1",
    pageNo: 1,
    reportingSubject: "Politics",
  },
  {
    id: 2,
    articleId: "002",
    articleDate: "2024-01-02",
    publicationName: "Global Times",
    headline: "Latest Update 2",
    pageNo: 2,
    reportingSubject: "Economy",
  },
  {
    id: 3,
    articleId: "003",
    articleDate: "2024-01-03",
    publicationName: "City Herald",
    headline: "Top Story 3",
    pageNo: 3,
    reportingSubject: "Health",
  },
  {
    id: 4,
    articleId: "004",
    articleDate: "2024-01-04",
    publicationName: "Morning Post",
    headline: "Exclusive 4",
    pageNo: 4,
    reportingSubject: "Technology",
  },
  {
    id: 5,
    articleId: "005",
    articleDate: "2024-01-05",
    publicationName: "Evening Star",
    headline: "Feature 5",
    pageNo: 5,
    reportingSubject: "Sports",
  },
  {
    id: 6,
    articleId: "006",
    articleDate: "2024-01-06",
    publicationName: "Weekly Review",
    headline: "In-depth 6",
    pageNo: 6,
    reportingSubject: "Science",
  },
  {
    id: 7,
    articleId: "007",
    articleDate: "2024-01-07",
    publicationName: "Daily News",
    headline: "News Flash 7",
    pageNo: 7,
    reportingSubject: "Entertainment",
  },
  {
    id: 8,
    articleId: "008",
    articleDate: "2024-01-08",
    publicationName: "Global Times",
    headline: "Update 8",
    pageNo: 8,
    reportingSubject: "World",
  },
  {
    id: 9,
    articleId: "009",
    articleDate: "2024-01-09",
    publicationName: "City Herald",
    headline: "Report 9",
    pageNo: 9,
    reportingSubject: "Environment",
  },
  {
    id: 10,
    articleId: "010",
    articleDate: "2024-01-10",
    publicationName: "Morning Post",
    headline: "News 10",
    pageNo: 10,
    reportingSubject: "Education",
  },
];
const StitchModal = ({ open, setOpen, articleId, isStitch, isUnStitch }) => {
  const handleClose = () => setOpen(false);

  //* fetch stitched articles
  const [date, setDate] = useState(formattedDate);
  const [fetchLoading, setFetchLoading] = useState(false);
  const fetchStitchedArticles = async () => {
    try {
      setFetchLoading(true);
      const params = {
        article_id: 83598910,
        date,
      };
      const endpoint =
        (isStitch && "articlestostich/") ||
        (isUnStitch && "getstichedarticles/");
      const userToken = localStorage.getItem("user");
      const response = await axios.get(`${url + endpoint}`, {
        headers: { Authorization: `Bearer ${userToken}` },
        params,
      });
      console.log(response.data);
    } catch (error) {
      console.log(error);
      console.log(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchStitchedArticles();
  }, [articleId, date]);

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
              {isStitch && <FromDate fromDate={date} setFromDate={setDate} />}

              <Typography component={"div"}>
                <Button>Save</Button>
                <Button>Cancel</Button>
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
