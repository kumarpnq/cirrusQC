import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardHeader,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// *icons
import CloseIcon from "@mui/icons-material/Close";
import { CloseOutlined } from "@mui/icons-material";
import { FaExternalLinkAlt } from "react-icons/fa";

// * component imports
import CustomTextField from "../../../@core/TextFieldWithLabel";
import DebounceSearchCompany from "../../../@core/DebounceSearchCompany";
import axios from "axios";
import { url } from "../../../constants/baseUrl";
// import { toast } from "react-toastify";

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

const EditDialog = ({ rowData, rowNumber, setRowNumber, open, setOpen }) => {
  const [row, setRow] = useState(null);

  useEffect(() => {
    const data = rowData[rowNumber] || null;
    setRow(data);
  }, [rowData, rowNumber, setRow]);

  const socialFeedId = row?.social_feed_id;
  const iframeURI = row?.link;
  const [formItems, setFormItems] = useState({
    headline: "",
    summary: "",
    journalist: "",
    tag: "",
  });

  const [selectedCompanies, setSelectedCompanies] = useState(null);
  const [socialFeedTagDetails, setSocialFeedTagDetails] = useState([]);
  const [socialFeedTagDetailsLoading, setSocialFeedTagDetailsLoading] =
    useState([]);

  const handleClose = () => {
    setRowNumber(0);
    setRow(null);
    setSocialFeedTagDetails([]);
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormItems({
      ...formItems,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form Submitted: ", formItems);
    handleClose();
  };

  const handleDeleteCompany = (row) => {
    console.log(row);
  };

  const columns = [
    {
      field: "Action",
      headerName: "Action",
      width: 70,
      renderCell: (params) => (
        <IconButton
          sx={{ color: "red" }}
          onClick={() => handleDeleteCompany(params.row)}
        >
          <CloseIcon />
        </IconButton>
      ),
    },
    { field: "CompanyName", headerName: "CompanyName", width: 300 },
  ];

  const rows = socialFeedTagDetails.map((detail, index) => ({
    id: index,
    CompanyName: detail.company_name,
  }));

  // * fetching header & tag details

  useEffect(() => {
    const fetchHeaderAndTagDetails = async () => {
      try {
        setSocialFeedTagDetailsLoading(true);
        const userToken = localStorage.getItem("user");
        const headers = {
          Authorization: `Bearer ${userToken}`,
        };

        const headerResponse = await axios.get(
          `${url}qc1onlineheader/?socialfeed_id=${socialFeedId}`,
          { headers }
        );
        const headerData = headerResponse.data.socialfeed[0] || {};
        setFormItems({
          headline: headerData.headline,
          summary: headerData.headsummary,
          journalist: headerData.author_name,
          tag: "",
        });

        const tagDetailsResponse = await axios.get(
          `${url}qc1onlinetagdetails/?socialfeed_id=${socialFeedId}`,
          { headers }
        );
        setSocialFeedTagDetails(tagDetailsResponse.data.socialfeed_details);
      } catch (error) {
        // toast.error("Error While fetching data.");
        console.log(error.message);
      } finally {
        setSocialFeedTagDetailsLoading(false);
      }
    };

    fetchHeaderAndTagDetails();
  }, [socialFeedId]);

  return (
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
            <Button variant="outlined">Save & Next</Button>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Typography>
        </Box>

        <Card>
          {" "}
          <CardHeader
            title={<Typography component={"span"}>Basic Details</Typography>}
          />
          <CardContent>
            <Box component="form" onSubmit={handleSubmit}>
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
                    id="tag"
                    name="tag"
                    label="Tag"
                    value={formItems.tag}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                title={
                  <Typography component={"span"}>Tagged Companies</Typography>
                }
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
                    loading={
                      socialFeedTagDetailsLoading && <CircularProgress />
                    }
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
                    href={iframeURI}
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
                  src={iframeURI}
                  frameBorder="0"
                  style={{ width: "100%", height: "540px" }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

EditDialog.propTypes = {
  rowData: PropTypes.array.isRequired,
  rowNumber: PropTypes.number.isRequired,
  setRowNumber: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default EditDialog;
