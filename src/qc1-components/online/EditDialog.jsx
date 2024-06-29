/*

print edit component

*/
import { Fragment, useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextField from "../../@core/TextFieldWithLabel";

import { DataGrid } from "@mui/x-data-grid";
import DebounceSearchCompany from "../../@core/DebounceSearchCompany";
import { FaExternalLinkAlt } from "react-icons/fa";
import StitchModal from "./components/StitchModal";
import axios from "axios";
import { url } from "../../constants/baseUrl";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "99vw",
  height: "99vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  overflow: "scroll",
  p: 1,
};

const titleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const EditDialog = ({ open, setOpen, row }) => {
  const articleId = row?.id;
  const [articleTagDetails, setArticleTagDetails] = useState([]);
  const [articleTagDetailsLoading, setArticleTagDetailsLoading] = useState([]);
  const [formItems, setFormItems] = useState({
    headline: "",
    summary: "",
    journalist: "",
    page: "",
    articleSummary: "",
  });

  // * fetch data
  const fetchHeaderAndTagDetails = async () => {
    try {
      setArticleTagDetailsLoading(true);
      const userToken = localStorage.getItem("user");
      const headers = {
        Authorization: `Bearer ${userToken}`,
      };

      const headerResponse = await axios.get(
        `${url}qc1printheader/?article_id=${articleId}`,
        { headers }
      );
      const headerData = headerResponse.data.socialfeed[0] || {};
      setFormItems({
        headline: "test headline",
        summary: "test Summary",
        journalist: "Sidd S",
        page: 5,
        articleSummary: "Article summary",
      });

      console.log(headerData);

      const tagDetailsResponse = await axios.get(
        `${url}qc1printtagdetails/?article_id=${articleId}`,
        { headers }
      );
      console.log(tagDetailsResponse);
      setArticleTagDetails(tagDetailsResponse.data.socialfeed_details || []);
    } catch (error) {
      // toast.error("Error While fetching data.");
      console.log(error);
      console.log(error.message);
    } finally {
      setArticleTagDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderAndTagDetails();
  }, [articleId]);

  const [selectedCompanies, setSelectedCompanies] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 70,
      renderCell: () => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => alert("Yeah You Clicked!")}
        >
          <CloseIcon />
        </IconButton>
      ),
    },
    { field: "CompanyName", headerName: "CompanyName", width: 300 },
  ];

  const rows = [
    {
      id: 1,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "American Express",
    },
    {
      id: 2,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "BMW India",
    },
    {
      id: 3,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "Tata Motors",
    },
    {
      id: 4,
      Action: (
        <IconButton color="red">
          <CloseIcon />
        </IconButton>
      ),
      CompanyName: "Volkswagen",
    },
  ];

  // * stitch modal
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <Fragment>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-dialog-title"
        aria-describedby="edit-dialog-description"
      >
        <Box sx={style}>
          <Box sx={titleStyle}>
            <Typography
              id="edit-dialog-title"
              variant="h6"
              component="h6"
              fontSize={"1em"}
            >
              Edit
            </Typography>
            <Typography id="edit-dialog-description" component={"div"}>
              <IconButton onClick={handleClose}>
                <CloseOutlined />
              </IconButton>
            </Typography>
          </Box>
          <Box>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  id="headline"
                  name="headline"
                  label="Headline"
                  value={formItems.headline}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  id="summary"
                  name="summary"
                  label="Summary"
                  value={formItems.summary}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  id="journalist"
                  name="journalist"
                  label="Journalist"
                  value={formItems.journalist}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  id="page"
                  name="page"
                  label="Page"
                  type="number"
                  value={formItems.page}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display={"flex"} alignItems={"center"}>
                  <CustomTextField
                    id="articleSummary"
                    name="articleSummary"
                    label="Article Summary"
                    value={formItems.articleSummary}
                    onChange={handleChange}
                    multiline
                    rows={4}
                  />
                  <Button onClick={() => setModalOpen((prev) => !prev)}>
                    Stitch
                  </Button>
                  <Button>unStitch</Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={1} mt={1}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader
                  title={<Typography component={"span"}>Companies</Typography>}
                />
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <DebounceSearchCompany
                      setSelectedCompany={setSelectedCompanies}
                    />
                    <Button>Add</Button>
                  </Box>
                  <Box height={500} width={"100%"}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      density="compact"
                      // loading={
                      //   socialFeedTagDetailsLoading && <CircularProgress />
                      // }
                      pageSize={5}
                      pageSizeOptions={[10, 100, 200, 1000]}
                      columnBufferPx={1000}
                      hideFooterSelectedRowCount
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader
                  title={
                    <Typography
                      variant="h6"
                      component={"a"}
                      display="flex"
                      alignItems="center"
                      gap={1}
                      fontSize={"0.9em"}
                      href={"https://marathi.abplive.com/"}
                      target="_blank"
                      rel="noreferrer"
                      fontFamily="nunito"
                      className="underline text-primary"
                    >
                      Article View
                      <FaExternalLinkAlt
                        style={{
                          fontSize: "1.2em",
                          fontFamily: "nunito",
                        }}
                      />
                    </Typography>
                  }
                />
                <CardContent>
                  <iframe
                    src={"https://marathi.abplive.com/"}
                    frameBorder="0"
                    style={{ width: "100%", height: "540px" }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <StitchModal open={modalOpen} setOpen={setModalOpen} />
    </Fragment>
  );
};

export default EditDialog;
